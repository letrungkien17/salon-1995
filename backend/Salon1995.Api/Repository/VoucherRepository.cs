using Microsoft.EntityFrameworkCore;
using Salon1995.Api.Data;
using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public class VoucherRepository : IVoucherRepository
{
    private readonly SalonDbContext _context;

    public VoucherRepository(SalonDbContext context)
    {
        _context = context;
    }

    public async Task<Voucher?> GetByCodeAsync(string code)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        return await _context.Vouchers.FirstOrDefaultAsync(v =>
            v.VoucherCode == code &&
            v.Status == "active" &&
            v.StartDate <= today &&
            v.EndDate >= today);
    }

    public async Task<IEnumerable<Voucher>> GetActiveVouchersAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        return await _context.Vouchers
            .Where(v => v.Status == "active" && v.StartDate <= today && v.EndDate >= today)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task UpdateAsync(Voucher voucher)
    {
        _context.Vouchers.Update(voucher);
        await _context.SaveChangesAsync();
    }
}
