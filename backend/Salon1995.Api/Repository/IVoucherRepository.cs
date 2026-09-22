using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public interface IVoucherRepository
{
    Task<Voucher?> GetByCodeAsync(string code);
    Task<IEnumerable<Voucher>> GetActiveVouchersAsync();
    Task UpdateAsync(Voucher voucher);
}
