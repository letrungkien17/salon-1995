using Salon1995.Api.Models;
using Salon1995.Api.Repository;

namespace Salon1995.Api.Services;

public interface IEmployeeService
{
    Task<IEnumerable<Employee>> GetEmployeesAsync(int? branchId = null, string? position = null);
    Task<Employee?> GetEmployeeByIdAsync(int id);
}

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;

    public EmployeeService(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public async Task<IEnumerable<Employee>> GetEmployeesAsync(int? branchId = null, string? position = null)
    {
        return await _employeeRepository.GetAllAsync(branchId, position);
    }

    public async Task<Employee?> GetEmployeeByIdAsync(int id)
    {
        return await _employeeRepository.GetByIdAsync(id);
    }
}
