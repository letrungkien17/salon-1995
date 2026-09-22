using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salon1995.Api.Helpers;
using Salon1995.Api.Models.DTOs;
using Salon1995.Api.Services;

namespace Salon1995.Api.Controllers.Api;

[ApiController]
[Route("api/orders")]
[Route("api/bookings")]
public class ApiOrdersController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public ApiOrdersController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<BookingResponseDto>.Fail("Dữ liệu không hợp lệ", 400, errors));
        }

        int? customerId = null;
        if (User.Identity != null && User.Identity.IsAuthenticated)
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(idStr, out var id)) customerId = id;
        }

        try
        {
            var result = await _bookingService.CreateBookingAsync(dto, customerId);
            return StatusCode(StatusCodes.Status201Created, ApiResponse<BookingResponseDto>.Created(result, "Đặt lịch hẹn thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<BookingResponseDto>.Fail(ex.Message, 400));
        }
    }

    [Authorize(Roles = "Admin,Staff,Manager")]
    [HttpGet]
    public async Task<IActionResult> GetAllBookings([FromQuery] string? date, [FromQuery] string? status, [FromQuery] int? branchId)
    {
        DateOnly? bookingDate = null;
        if (!string.IsNullOrWhiteSpace(date) && DateOnly.TryParse(date, out var parsedDate))
        {
            bookingDate = parsedDate;
        }

        var result = await _bookingService.GetAllBookingsAsync(bookingDate, status, branchId);
        return Ok(ApiResponse<IEnumerable<BookingResponseDto>>.Ok(result, "Lấy danh sách lịch hẹn thành công"));
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookings()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idStr, out var customerId))
        {
            return Unauthorized(ApiResponse<IEnumerable<BookingResponseDto>>.Fail("Không xác định được khách hàng", 401));
        }

        var result = await _bookingService.GetCustomerBookingsAsync(customerId);
        return Ok(ApiResponse<IEnumerable<BookingResponseDto>>.Ok(result, "Lấy lịch hẹn của bạn thành công"));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        if (booking == null)
        {
            return NotFound(ApiResponse<BookingResponseDto>.Fail("Không tìm thấy đơn hẹn", 404));
        }

        var role = User.FindFirstValue(ClaimTypes.Role);
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (role == "Customer" && int.TryParse(userIdStr, out var customerId))
        {
            if (booking.CustomerId != customerId)
            {
                return StatusCode(StatusCodes.Status403Forbidden, 
                    ApiResponse<BookingResponseDto>.Fail("Bạn không có quyền truy cập đơn hẹn của người khác", 403));
            }
        }

        return Ok(ApiResponse<BookingResponseDto>.Ok(booking, "Lấy chi tiết đơn hẹn thành công"));
    }


    [Authorize(Roles = "Admin,Staff,Manager")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusDto dto)
    {
        var success = await _bookingService.UpdateStatusAsync(id, dto.Status);
        if (!success)
        {
            return NotFound(ApiResponse<bool>.Fail("Không tìm thấy đơn hẹn để cập nhật", 404));
        }
        return Ok(ApiResponse<bool>.Ok(true, $"Đã cập nhật trạng thái đơn hẹn thành: {dto.Status}"));
    }

    [HttpGet("slots")]
    public async Task<IActionResult> GetSlots([FromQuery] int branchId, [FromQuery] string? date, [FromQuery] int? staffId)
    {
        var bookingDate = DateOnly.FromDateTime(DateTime.UtcNow);
        if (!string.IsNullOrWhiteSpace(date) && DateOnly.TryParse(date, out var d))
        {
            bookingDate = d;
        }

        var slots = await _bookingService.GetAvailableTimeSlotsAsync(branchId > 0 ? branchId : 1, bookingDate, staffId);
        return Ok(ApiResponse<IEnumerable<TimeSlotDto>>.Ok(slots, "Lấy khung giờ trống thành công"));
    }
}
