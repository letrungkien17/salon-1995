using Microsoft.EntityFrameworkCore;
using Salon1995.Api.Data;
using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public class BookingRepository : IBookingRepository
{
    private readonly SalonDbContext _context;

    public BookingRepository(SalonDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync(DateOnly? date = null, string? status = null, int? branchId = null)
    {
        var query = _context.Bookings
            .Include(b => b.Customer)
            .Include(b => b.Branch)
            .Include(b => b.Payment)
            .Include(b => b.BookingDetails)!
                .ThenInclude(d => d.Service)
            .Include(b => b.BookingDetails)!
                .ThenInclude(d => d.Employee)
            .AsNoTracking()
            .AsQueryable();

        if (date.HasValue)
        {
            query = query.Where(b => b.BookingDate == date.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(b => b.Status == status);
        }

        if (branchId.HasValue && branchId.Value > 0)
        {
            query = query.Where(b => b.BranchId == branchId.Value);
        }

        return await query.OrderByDescending(b => b.BookingDate)
                          .ThenByDescending(b => b.BookingTime)
                          .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetByCustomerIdAsync(int customerId)
    {
        return await _context.Bookings
            .Include(b => b.Branch)
            .Include(b => b.Payment)
            .Include(b => b.BookingDetails)!
                .ThenInclude(d => d.Service)
            .Include(b => b.BookingDetails)!
                .ThenInclude(d => d.Employee)
            .Where(b => b.CustomerId == customerId)
            .OrderByDescending(b => b.BookingDate)
            .ThenByDescending(b => b.BookingTime)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Booking?> GetByIdAsync(int id)
    {
        return await _context.Bookings
            .Include(b => b.Customer)
            .Include(b => b.Branch)
            .Include(b => b.Payment)
            .Include(b => b.BookingDetails)!
                .ThenInclude(d => d.Service)
            .Include(b => b.BookingDetails)!
                .ThenInclude(d => d.Employee)
            .FirstOrDefaultAsync(b => b.BookingId == id);
    }

    public async Task<Booking> AddAsync(Booking booking)
    {
        await _context.Bookings.AddAsync(booking);
        await _context.SaveChangesAsync();
        return booking;
    }

    public async Task UpdateAsync(Booking booking)
    {
        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<BookingDetail>> GetConflictingDetailsAsync(int employeeId, DateOnly date, TimeSpan startTime, TimeSpan endTime)
    {
        return await _context.BookingDetails
            .Include(d => d.Booking)
            .Where(d => d.EmployeeId == employeeId &&
                        d.Booking != null &&
                        d.Booking.BookingDate == date &&
                        d.Booking.Status != "Đã huỷ" &&
                        d.StartTime.HasValue &&
                        d.EndTime.HasValue &&
                        d.StartTime.Value < endTime &&
                        startTime < d.EndTime.Value)
            .AsNoTracking()
            .ToListAsync();
    }
}
