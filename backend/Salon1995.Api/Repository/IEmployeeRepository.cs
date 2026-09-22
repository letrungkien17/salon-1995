using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public interface IEmployeeRepository
{
    Task<IEnumerable<Employee>> GetAllAsync(int? branchId = null, string? position = null);
    Task<Employee?> GetByIdAsync(int id);
    Task<IEnumerable<Employee>> GetByServiceIdAsync(int serviceId);
    Task<IEnumerable<WorkShift>> GetShiftsAsync(int? branchId = null, DateOnly? date = null);
}
