using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync(DateOnly? date = null, string? status = null, int? branchId = null);
    Task<IEnumerable<Booking>> GetByCustomerIdAsync(int customerId);
    Task<Booking?> GetByIdAsync(int id);
    Task<Booking> AddAsync(Booking booking);
    Task UpdateAsync(Booking booking);
    Task<IEnumerable<BookingDetail>> GetConflictingDetailsAsync(int employeeId, DateOnly date, TimeSpan startTime, TimeSpan endTime);
}
