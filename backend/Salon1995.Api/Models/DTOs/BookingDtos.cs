using System.ComponentModel.DataAnnotations;

namespace Salon1995.Api.Models.DTOs;

public class CreateBookingDto
{
    [Required(ErrorMessage = "Vui lòng chọn chi nhánh")]
    public int BranchId { get; set; } = 1;

    [Required(ErrorMessage = "Vui lòng nhập họ và tên khách hàng")]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
    [RegularExpression(@"^(03|05|07|08|09)\d{8}$", ErrorMessage = "Số điện thoại di động Việt Nam không hợp lệ")]
    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    [Required(ErrorMessage = "Vui lòng chọn ngày hẹn")]
    public DateOnly BookingDate { get; set; }

    [Required(ErrorMessage = "Vui lòng chọn giờ hẹn")]
    public string BookingTime { get; set; } = string.Empty; // "09:00:00"

    public string? Note { get; set; }

    public string? VoucherCode { get; set; }

    public string PaymentMethod { get; set; } = "Tiền mặt";

    [Required(ErrorMessage = "Vui lòng chọn ít nhất một dịch vụ")]
    [MinLength(1, ErrorMessage = "Vui lòng chọn ít nhất một dịch vụ")]
    public List<BookingServiceItemDto> Services { get; set; } = new();
}

public class BookingServiceItemDto
{
    public int ServiceId { get; set; }
    public int? EmployeeId { get; set; } // Nullable if salon auto-assigns best staff
}

public class BookingResponseDto
{
    public int BookingId { get; set; }
    public string BookingCode => $"BK-1995-{BookingId:D5}";
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public string BranchAddress { get; set; } = string.Empty;
    public DateOnly BookingDate { get; set; }
    public string BookingTime { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
    public string PaymentStatus { get; set; } = "Chưa thanh toán";
    public string PaymentMethod { get; set; } = "Tiền mặt";
    public DateTime CreatedAt { get; set; }
    public List<BookingDetailItemResponseDto> Details { get; set; } = new();
}

public class BookingDetailItemResponseDto
{
    public int BookingDetailId { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Status { get; set; } = "Chờ";
}

public class TimeSlotDto
{
    public string Time { get; set; } = string.Empty;
    public bool IsAvailable { get; set; } = true;
    public string? Reason { get; set; }
}

public class UpdateBookingStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // 'Chờ xác nhận','Đã xác nhận','Đang thực hiện','Hoàn thành','Đã huỷ','Không đến'
}
