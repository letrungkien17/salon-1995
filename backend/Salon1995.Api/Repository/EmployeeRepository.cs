using Microsoft.EntityFrameworkCore;
using Salon1995.Api.Data;
using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly SalonDbContext _context;

    public EmployeeRepository(SalonDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Employee>> GetAllAsync(int? branchId = null, string? position = null)
    {
        var query = _context.Employees
            .Include(e => e.Branch)
            .Include(e => e.Skills)!
                .ThenInclude(s => s.Service)
            .Where(e => e.Status == "active")
            .AsNoTracking()
            .AsQueryable();

        if (branchId.HasValue && branchId.Value > 0)
        {
            query = query.Where(e => e.BranchId == branchId.Value);
        }

        if (!string.IsNullOrWhiteSpace(position))
        {
            query = query.Where(e => e.Position == position);
        }

        return await query.ToListAsync();
    }

    public async Task<Employee?> GetByIdAsync(int id)
    {
        return await _context.Employees
            .Include(e => e.Branch)
            .Include(e => e.Skills)!
                .ThenInclude(s => s.Service)
            .FirstOrDefaultAsync(e => e.EmployeeId == id);
    }

    public async Task<IEnumerable<Employee>> GetByServiceIdAsync(int serviceId)
    {
        return await _context.Employees
            .Include(e => e.Skills)
            .Where(e => e.Status == "active" && e.Skills!.Any(s => s.ServiceId == serviceId))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<WorkShift>> GetShiftsAsync(int? branchId = null, DateOnly? date = null)
    {
        var query = _context.WorkShifts
            .Include(s => s.Employee)
            .AsNoTracking()
            .AsQueryable();

        if (branchId.HasValue && branchId.Value > 0)
        {
            query = query.Where(s => s.BranchId == branchId.Value);
        }

        if (date.HasValue)
        {
            query = query.Where(s => s.WorkDate == date.Value);
        }

        return await query.ToListAsync();
    }
}
