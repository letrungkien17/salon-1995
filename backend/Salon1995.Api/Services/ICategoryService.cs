using Salon1995.Api.Models;

namespace Salon1995.Api.Services;

public interface ICategoryService
{
    Task<IEnumerable<ServiceCategory>> GetAllCategoriesAsync();
    Task<ServiceCategory?> GetCategoryByIdAsync(int id);
}
