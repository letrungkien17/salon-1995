using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salon1995.Api.Helpers;
using Salon1995.Api.Models.DTOs;
using Salon1995.Api.Services;

namespace Salon1995.Api.Controllers.Api;

[ApiController]
[Route("api/auth")]
public class ApiAuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public ApiAuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<AuthResponseDto>.Fail("Dữ liệu không hợp lệ", 400, errors));
        }

        var result = await _authService.LoginAsync(request);
        if (result == null)
        {
            return Unauthorized(ApiResponse<AuthResponseDto>.Fail("Tên đăng nhập hoặc mật khẩu không chính xác", 401));
        }

        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Đăng nhập thành công"));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<RegisterResponseDto>.Fail("Dữ liệu không hợp lệ", 400, errors));
        }

        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(ApiResponse<RegisterResponseDto>.Ok(result, result.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<RegisterResponseDto>.Fail(ex.Message, 400));
        }
    }


    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<AuthResponseDto>.Fail("Dữ liệu không hợp lệ", 400, errors));
        }

        var result = await _authService.RefreshTokenAsync(request.RefreshToken);
        if (result == null)
        {
            return Unauthorized(ApiResponse<AuthResponseDto>.Fail("Refresh token không hợp lệ, đã bị thu hồi hoặc đã hết hạn", 401));
        }

        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Làm mới Access Token thành công"));
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<bool>.Fail("Vui lòng cung cấp Refresh Token", 400));
        }

        var success = await _authService.RevokeTokenAsync(request.RefreshToken);
        if (!success)
        {
            return NotFound(ApiResponse<bool>.Fail("Không tìm thấy Refresh Token để thu hồi", 404));
        }

        return Ok(ApiResponse<bool>.Ok(true, "Thu hồi Refresh Token thành công"));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Customer";

        if (!int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized(ApiResponse<UserProfileDto>.Fail("Không xác định được người dùng", 401));
        }

        var profile = await _authService.GetProfileAsync(userId, role);
        if (profile == null)
        {
            return NotFound(ApiResponse<UserProfileDto>.Fail("Không tìm thấy thông tin tài khoản", 404));
        }

        return Ok(ApiResponse<UserProfileDto>.Ok(profile, "Lấy thông tin tài khoản thành công"));
    }
}
