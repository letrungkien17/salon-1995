using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public interface ICategoryRepository
{
    Task<IEnumerable<ServiceCategory>> GetAllAsync();
    Task<ServiceCategory?> GetByIdAsync(int id);
    Task<ServiceCategory> AddAsync(ServiceCategory category);
    Task UpdateAsync(ServiceCategory category);
    Task DeleteAsync(int id);
}
