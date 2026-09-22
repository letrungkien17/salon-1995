using Microsoft.EntityFrameworkCore;
using Salon1995.Api.Data;
using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public class ServiceRepository : IServiceRepository
{
    private readonly SalonDbContext _context;

    public ServiceRepository(SalonDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Service>> GetAllAsync(int? categoryId = null, string? search = null)
    {
        var query = _context.Services.Include(s => s.Category).AsNoTracking().AsQueryable();

        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(s => s.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(s => s.ServiceName.Contains(search) || (s.Description != null && s.Description.Contains(search)));
        }

        return await query.OrderBy(s => s.CategoryId).ThenBy(s => s.Price).ToListAsync();
    }

    public async Task<Service?> GetByIdAsync(int id)
    {
        return await _context.Services
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.ServiceId == id);
    }

    public async Task<Service> AddAsync(Service service)
    {
        await _context.Services.AddAsync(service);
        await _context.SaveChangesAsync();
        return service;
    }

    public async Task UpdateAsync(Service service)
    {
        _context.Services.Update(service);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service != null)
        {
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
        }
    }
}
