using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(int? branchId = null);
    Task<Product?> GetByIdAsync(int id);
}
