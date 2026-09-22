using Salon1995.Api.Models;

namespace Salon1995.Api.Services;

public interface IProductService
{
    Task<IEnumerable<Service>> GetAllServicesAsync(int? categoryId = null, string? search = null);
    Task<Service?> GetServiceByIdAsync(int id);
    Task<IEnumerable<Product>> GetAllProductsAsync(int? branchId = null);
}
