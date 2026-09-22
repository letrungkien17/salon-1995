using Microsoft.AspNetCore.Mvc;
using Salon1995.Api.Helpers;
using Salon1995.Api.Models;
using Salon1995.Api.Services;

namespace Salon1995.Api.Controllers.Api;

[ApiController]
[Route("api/categories")]
public class ApiCategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public ApiCategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return Ok(ApiResponse<IEnumerable<ServiceCategory>>.Ok(categories, "Lấy danh mục thành công"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null)
        {
            return NotFound(ApiResponse<ServiceCategory>.Fail("Không tìm thấy danh mục", 404));
        }
        return Ok(ApiResponse<ServiceCategory>.Ok(category, "Lấy thông tin danh mục thành công"));
    }
}
