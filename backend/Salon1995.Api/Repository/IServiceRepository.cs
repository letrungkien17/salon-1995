using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public interface IServiceRepository
{
    Task<IEnumerable<Service>> GetAllAsync(int? categoryId = null, string? search = null);
    Task<Service?> GetByIdAsync(int id);
    Task<Service> AddAsync(Service service);
    Task UpdateAsync(Service service);
    Task DeleteAsync(int id);
}
