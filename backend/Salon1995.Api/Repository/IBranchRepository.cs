using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public interface IBranchRepository
{
    Task<IEnumerable<Branch>> GetAllAsync();
    Task<Branch?> GetByIdAsync(int id);
}
