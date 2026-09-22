using Microsoft.AspNetCore.Mvc;
using Salon1995.Api.Helpers;
using Salon1995.Api.Models;
using Salon1995.Api.Repository;

namespace Salon1995.Api.Controllers.Api;

[ApiController]
[Route("api/branches")]
public class ApiBranchesController : ControllerBase
{
    private readonly IBranchRepository _branchRepository;

    public ApiBranchesController(IBranchRepository branchRepository)
    {
        _branchRepository = branchRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var branches = await _branchRepository.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<Branch>>.Ok(branches, "Lấy danh sách chi nhánh thành công"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var branch = await _branchRepository.GetByIdAsync(id);
        if (branch == null)
        {
            return NotFound(ApiResponse<Branch>.Fail("Không tìm thấy chi nhánh", 404));
        }
        return Ok(ApiResponse<Branch>.Ok(branch, "Lấy thông tin chi nhánh thành công"));
    }
}
