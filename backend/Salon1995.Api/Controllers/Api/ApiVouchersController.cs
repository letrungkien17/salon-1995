using Microsoft.AspNetCore.Mvc;
using Salon1995.Api.Helpers;
using Salon1995.Api.Models;
using Salon1995.Api.Repository;

namespace Salon1995.Api.Controllers.Api;

[ApiController]
[Route("api/vouchers")]
public class ApiVouchersController : ControllerBase
{
    private readonly IVoucherRepository _voucherRepository;

    public ApiVouchersController(IVoucherRepository voucherRepository)
    {
        _voucherRepository = voucherRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetActiveVouchers()
    {
        var vouchers = await _voucherRepository.GetActiveVouchersAsync();
        return Ok(ApiResponse<IEnumerable<Voucher>>.Ok(vouchers, "Lấy danh sách mã giảm giá thành công"));
    }

    [HttpGet("check/{code}")]
    public async Task<IActionResult> CheckVoucher(string code)
    {
        var voucher = await _voucherRepository.GetByCodeAsync(code.ToUpper());
        if (voucher == null)
        {
            return NotFound(ApiResponse<Voucher>.Fail("Mã giảm giá không tồn tại hoặc đã hết hạn", 404));
        }
        return Ok(ApiResponse<Voucher>.Ok(voucher, "Mã giảm giá hợp lệ"));
    }
}
