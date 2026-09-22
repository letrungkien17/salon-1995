using Microsoft.EntityFrameworkCore;
using Salon1995.Api.Data;
using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public class CategoryRepository : ICategoryRepository
{
    private readonly SalonDbContext _context;

    public CategoryRepository(SalonDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ServiceCategory>> GetAllAsync()
    {
        return await _context.ServiceCategories
            .Include(c => c.Services)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<ServiceCategory?> GetByIdAsync(int id)
    {
        return await _context.ServiceCategories
            .Include(c => c.Services)
            .FirstOrDefaultAsync(c => c.CategoryId == id);
    }

    public async Task<ServiceCategory> AddAsync(ServiceCategory category)
    {
        await _context.ServiceCategories.AddAsync(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task UpdateAsync(ServiceCategory category)
    {
        _context.ServiceCategories.Update(category);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var category = await _context.ServiceCategories.FindAsync(id);
        if (category != null)
        {
            _context.ServiceCategories.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
}
