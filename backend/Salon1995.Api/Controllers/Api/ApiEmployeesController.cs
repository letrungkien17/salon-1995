using Microsoft.AspNetCore.Mvc;
using Salon1995.Api.Helpers;
using Salon1995.Api.Models;
using Salon1995.Api.Services;

namespace Salon1995.Api.Controllers.Api;

[ApiController]
[Route("api/employees")]
[Route("api/staff")]
public class ApiEmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public ApiEmployeesController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? branchId, [FromQuery] string? position)
    {
        var staff = await _employeeService.GetEmployeesAsync(branchId, position);
        return Ok(ApiResponse<IEnumerable<Employee>>.Ok(staff, "Lấy danh sách nhân viên thành công"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var employee = await _employeeService.GetEmployeeByIdAsync(id);
        if (employee == null)
        {
            return NotFound(ApiResponse<Employee>.Fail("Không tìm thấy nhân viên", 404));
        }
        return Ok(ApiResponse<Employee>.Ok(employee, "Lấy thông tin nhân viên thành công"));
    }
}
