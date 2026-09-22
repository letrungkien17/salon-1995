using Microsoft.EntityFrameworkCore;
using Salon1995.Api.Data;
using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public class BranchRepository : IBranchRepository
{
    private readonly SalonDbContext _context;

    public BranchRepository(SalonDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Branch>> GetAllAsync()
    {
        return await _context.Branches.Where(b => b.Status == "active").AsNoTracking().ToListAsync();
    }

    public async Task<Branch?> GetByIdAsync(int id)
    {
        return await _context.Branches.FindAsync(id);
    }
}
