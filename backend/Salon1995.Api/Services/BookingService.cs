using Salon1995.Api.Models;
using Salon1995.Api.Models.DTOs;
using Salon1995.Api.Repository;

namespace Salon1995.Api.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IUserRepository _userRepository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly IVoucherRepository _voucherRepository;
    private readonly IQueueService _queueService;
    private readonly ILogger<BookingService> _logger;

    public BookingService(
        IBookingRepository bookingRepository,
        IUserRepository userRepository,
        IServiceRepository serviceRepository,
        IEmployeeRepository employeeRepository,
        IBranchRepository branchRepository,
        IVoucherRepository voucherRepository,
        IQueueService queueService,
        ILogger<BookingService> logger)
    {
        _bookingRepository = bookingRepository;
        _userRepository = userRepository;
        _serviceRepository = serviceRepository;
        _employeeRepository = employeeRepository;
        _branchRepository = branchRepository;
        _voucherRepository = voucherRepository;
        _queueService = queueService;
        _logger = logger;
    }

    public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto, int? authenticatedCustomerId = null)
    {
        // 1. Tìm hoặc tự động tạo tài khoản Customer theo SĐT
        Customer? customer = null;
        if (authenticatedCustomerId.HasValue && authenticatedCustomerId.Value > 0)
        {
            customer = await _userRepository.GetCustomerByIdAsync(authenticatedCustomerId.Value);
        }

        if (customer == null)
        {
            customer = await _userRepository.GetCustomerByPhoneAsync(dto.Phone);
            if (customer == null)
            {
                customer = new Customer
                {
                    FullName = dto.CustomerName.Trim(),
                    Phone = dto.Phone.Trim(),
                    Email = dto.Email?.Trim(),
                    MembershipLevel = "Thường",
                    AccountStatus = "Hoạt động",
                    IsPhoneVerified = false,
                    CreatedAt = DateTime.UtcNow
                };
                customer = await _userRepository.AddCustomerAsync(customer);
            }
        }

        // 2. Kiểm tra chi nhánh
        var branch = await _branchRepository.GetByIdAsync(dto.BranchId)
            ?? throw new InvalidOperationException("Chi nhánh không tồn tại");

        // 3. Phân tích giờ bắt đầu
        if (!TimeSpan.TryParse(dto.BookingTime, out var bookingTime))
        {
            throw new ArgumentException("Định dạng giờ hẹn không hợp lệ (Ví dụ: 09:00:00)");
        }

        // 4. Lấy danh sách nhân viên chi nhánh để tự động xếp nếu khách chưa chọn thợ
        var branchEmployees = (await _employeeRepository.GetAllAsync(dto.BranchId)).ToList();
        if (!branchEmployees.Any())
        {
            throw new InvalidOperationException("Chi nhánh hiện chưa có nhân viên trực");
        }

        // 5. Chuẩn bị các chi tiết dịch vụ
        var bookingDetails = new List<BookingDetail>();
        decimal totalAmount = 0;
        var currentSlotStart = bookingTime;

        foreach (var item in dto.Services)
        {
            var service = await _serviceRepository.GetByIdAsync(item.ServiceId)
                ?? throw new InvalidOperationException($"Dịch vụ #{item.ServiceId} không tồn tại");

            var duration = TimeSpan.FromMinutes(service.DurationMinutes);
            var currentSlotEnd = currentSlotStart.Add(duration);

            int assignedStaffId = item.EmployeeId ?? 0;
            if (assignedStaffId <= 0)
            {
                // Chọn thợ có kỹ năng làm dịch vụ này hoặc thợ đầu tiên
                var suitableStaff = branchEmployees.FirstOrDefault(e => e.Skills != null && e.Skills.Any(s => s.ServiceId == service.ServiceId))
                                    ?? branchEmployees.First();
                assignedStaffId = suitableStaff.EmployeeId;
            }

            // Kiểm tra xung đột lịch của thợ
            var conflicts = await _bookingRepository.GetConflictingDetailsAsync(assignedStaffId, dto.BookingDate, currentSlotStart, currentSlotEnd);
            if (conflicts.Any())
            {
                _logger.LogWarning("Thợ #{StaffId} đã có lịch trong khung giờ {Start}-{End}", assignedStaffId, currentSlotStart, currentSlotEnd);
            }

            bookingDetails.Add(new BookingDetail
            {
                ServiceId = service.ServiceId,
                EmployeeId = assignedStaffId,
                Price = service.Price,
                StartTime = currentSlotStart,
                EndTime = currentSlotEnd,
                Status = "Chờ"
            });

            totalAmount += service.Price;
            currentSlotStart = currentSlotEnd; // Dịch vụ kế tiếp bắt đầu sau khi dịch vụ trước kết thúc
        }

        // 6. Tính toán chiết khấu voucher (nếu có)
        decimal discountAmount = 0;
        Voucher? appliedVoucher = null;
        if (!string.IsNullOrWhiteSpace(dto.VoucherCode))
        {
            appliedVoucher = await _voucherRepository.GetByCodeAsync(dto.VoucherCode.Trim().ToUpper());
            if (appliedVoucher != null)
            {
                if (appliedVoucher.DiscountType == "percent")
                {
                    discountAmount = totalAmount * (appliedVoucher.DiscountValue / 100m);
                }
                else
                {
                    discountAmount = appliedVoucher.DiscountValue;
                }

                if (discountAmount > totalAmount) discountAmount = totalAmount;

                appliedVoucher.UsedCount++;
                await _voucherRepository.UpdateAsync(appliedVoucher);
            }
        }

        decimal finalAmount = totalAmount - discountAmount;
        if (finalAmount < 0) finalAmount = 0;

        // 7. Tạo đối tượng Booking và Payment
        var booking = new Booking
        {
            CustomerId = customer.CustomerId,
            BranchId = dto.BranchId,
            BookingDate = dto.BookingDate,
            BookingTime = bookingTime,
            Status = "Chờ xác nhận",
            Note = dto.Note,
            CreatedAt = DateTime.UtcNow,
            BookingDetails = bookingDetails,
            Payment = new Payment
            {
                VoucherId = appliedVoucher?.VoucherId,
                PaymentMethod = dto.PaymentMethod,
                TotalAmount = totalAmount,
                DiscountAmount = discountAmount,
                FinalAmount = finalAmount,
                PaymentStatus = "Chưa thanh toán"
            }
        };

        var createdBooking = await _bookingRepository.AddAsync(booking);

        // 8. Đẩy sự kiện vào RabbitMQ Message Queue
        var eventPayload = new
        {
            BookingId = createdBooking.BookingId,
            CustomerName = customer.FullName,
            CustomerPhone = customer.Phone,
            BranchName = branch.BranchName,
            BookingDate = dto.BookingDate.ToString("yyyy-MM-dd"),
            BookingTime = dto.BookingTime,
            FinalAmount = finalAmount
        };
        await _queueService.PublishBookingEventAsync("BookingCreated", eventPayload);

        // 9. Trả về kết quả
        return MapToResponse(createdBooking, customer, branch);
    }

    public async Task<IEnumerable<BookingResponseDto>> GetAllBookingsAsync(DateOnly? date = null, string? status = null, int? branchId = null)
    {
        var bookings = await _bookingRepository.GetAllAsync(date, status, branchId);
        return bookings.Select(b => MapToResponse(b, b.Customer, b.Branch)).ToList();
    }

    public async Task<IEnumerable<BookingResponseDto>> GetCustomerBookingsAsync(int customerId)
    {
        var bookings = await _bookingRepository.GetByCustomerIdAsync(customerId);
        return bookings.Select(b => MapToResponse(b, b.Customer, b.Branch)).ToList();
    }

    public async Task<BookingResponseDto?> GetBookingByIdAsync(int id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);
        if (booking == null) return null;
        return MapToResponse(booking, booking.Customer, booking.Branch);
    }

    public async Task<bool> UpdateStatusAsync(int id, string newStatus)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);
        if (booking == null) return false;

        booking.Status = newStatus;

        if (booking.Payment != null)
        {
            if (newStatus == "Hoàn thành")
            {
                booking.Payment.PaymentStatus = "Đã thanh toán";
                booking.Payment.PaymentDate = DateTime.UtcNow;
            }
            else if (newStatus == "Đã huỷ")
            {
                booking.Payment.PaymentStatus = "Đã huỷ";
            }
        }

        if (booking.BookingDetails != null)
        {
            foreach (var d in booking.BookingDetails)
            {
                if (newStatus == "Đang thực hiện") d.Status = "Đang làm";
                else if (newStatus == "Hoàn thành") d.Status = "Hoàn thành";
                else if (newStatus == "Đã huỷ") d.Status = "Huỷ";
            }
        }

        await _bookingRepository.UpdateAsync(booking);

        // Đẩy sự kiện thay đổi trạng thái vào Queue
        await _queueService.PublishBookingEventAsync("BookingStatusChanged", new
        {
            BookingId = id,
            Status = newStatus,
            CustomerPhone = booking.Customer?.Phone
        });

        return true;
    }

    public async Task<IEnumerable<TimeSlotDto>> GetAvailableTimeSlotsAsync(int branchId, DateOnly date, int? staffId = null)
    {
        // Các khung giờ tiêu chuẩn từ 08:30 đến 20:00 (mỗi ca cách nhau 30 phút)
        var slots = new List<string>
        {
            "08:30:00", "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00",
            "11:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00",
            "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00", "18:00:00",
            "18:30:00", "19:00:00", "19:30:00", "20:00:00"
        };

        var existingBookings = await _bookingRepository.GetAllAsync(date, null, branchId);
        var activeBookings = existingBookings.Where(b => b.Status != "Đã huỷ").ToList();

        var result = new List<TimeSlotDto>();
        foreach (var s in slots)
        {
            var slotTime = TimeSpan.Parse(s);
            // Kiểm tra số lượng khách đã đặt cùng giờ này
            int count = activeBookings.Count(b => b.BookingTime == slotTime);
            // Giả sử mỗi chi nhánh tiếp tối đa 4 khách cùng lúc
            bool isAvailable = count < 4;

            result.Add(new TimeSlotDto
            {
                Time = s[..5], // "08:30"
                IsAvailable = isAvailable,
                Reason = isAvailable ? "Còn chỗ" : "Kín lịch"
            });
        }

        return result;
    }

    private static BookingResponseDto MapToResponse(Booking b, Customer? c, Branch? br)
    {
        return new BookingResponseDto
        {
            BookingId = b.BookingId,
            CustomerId = b.CustomerId,
            CustomerName = c?.FullName ?? "Khách vãng lai",
            CustomerPhone = c?.Phone ?? "",
            BranchId = b.BranchId,
            BranchName = br?.BranchName ?? "Salon 1995",
            BranchAddress = br?.Address ?? "",
            BookingDate = b.BookingDate,
            BookingTime = b.BookingTime.ToString(@"hh\:mm"),
            Status = b.Status,
            Note = b.Note,
            TotalAmount = b.Payment?.TotalAmount ?? 0,
            DiscountAmount = b.Payment?.DiscountAmount ?? 0,
            FinalAmount = b.Payment?.FinalAmount ?? 0,
            PaymentStatus = b.Payment?.PaymentStatus ?? "Chưa thanh toán",
            PaymentMethod = b.Payment?.PaymentMethod ?? "Tiền mặt",
            CreatedAt = b.CreatedAt,
            Details = b.BookingDetails?.Select(d => new BookingDetailItemResponseDto
            {
                BookingDetailId = d.BookingDetailId,
                ServiceId = d.ServiceId,
                ServiceName = d.Service?.ServiceName ?? "",
                DurationMinutes = d.Service?.DurationMinutes ?? 60,
                Price = d.Price,
                EmployeeId = d.EmployeeId,
                EmployeeName = d.Employee?.FullName ?? "",
                Status = d.Status
            }).ToList() ?? new()
        };
    }
}
