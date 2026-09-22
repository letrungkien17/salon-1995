using Microsoft.AspNetCore.Mvc;
using Salon1995.Api.Helpers;
using Salon1995.Api.Models;
using Salon1995.Api.Services;

namespace Salon1995.Api.Controllers.Api;

[ApiController]
[Route("api/products")]
[Route("api/services")]
public class ApiProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ApiProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllServices([FromQuery] int? categoryId, [FromQuery] string? search)
    {
        var services = await _productService.GetAllServicesAsync(categoryId, search);
        return Ok(ApiResponse<IEnumerable<Service>>.Ok(services, "Lấy danh sách dịch vụ salon thành công"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetServiceById(int id)
    {
        var service = await _productService.GetServiceByIdAsync(id);
        if (service == null)
        {
            return NotFound(ApiResponse<Service>.Fail("Không tìm thấy dịch vụ", 404));
        }
        return Ok(ApiResponse<Service>.Ok(service, "Lấy thông tin dịch vụ thành công"));
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetAllCosmeticProducts([FromQuery] int? branchId)
    {
        var products = await _productService.GetAllProductsAsync(branchId);
        return Ok(ApiResponse<IEnumerable<Product>>.Ok(products, "Lấy danh sách mỹ phẩm/sản phẩm thành công"));
    }
}
