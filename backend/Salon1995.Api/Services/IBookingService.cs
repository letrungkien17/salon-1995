using Salon1995.Api.Models.DTOs;

namespace Salon1995.Api.Services;

public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto, int? authenticatedCustomerId = null);
    Task<IEnumerable<BookingResponseDto>> GetAllBookingsAsync(DateOnly? date = null, string? status = null, int? branchId = null);
    Task<IEnumerable<BookingResponseDto>> GetCustomerBookingsAsync(int customerId);
    Task<BookingResponseDto?> GetBookingByIdAsync(int id);
    Task<bool> UpdateStatusAsync(int id, string newStatus);
    Task<IEnumerable<TimeSlotDto>> GetAvailableTimeSlotsAsync(int branchId, DateOnly date, int? staffId = null);
}
