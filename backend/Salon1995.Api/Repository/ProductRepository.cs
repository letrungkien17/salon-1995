using Microsoft.EntityFrameworkCore;
using Salon1995.Api.Data;
using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public class ProductRepository : IProductRepository
{
    private readonly SalonDbContext _context;

    public ProductRepository(SalonDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllAsync(int? branchId = null)
    {
        var query = _context.Products.Include(p => p.Branch).AsNoTracking().AsQueryable();
        if (branchId.HasValue && branchId.Value > 0)
        {
            query = query.Where(p => p.BranchId == branchId.Value);
        }
        return await query.ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products.Include(p => p.Branch).FirstOrDefaultAsync(p => p.ProductId == id);
    }
}
