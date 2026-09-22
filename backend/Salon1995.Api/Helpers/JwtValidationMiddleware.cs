using Salon1995.Api.Services;

namespace Salon1995.Api.Helpers;

public class JwtValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<JwtValidationMiddleware> _logger;

    public JwtValidationMiddleware(RequestDelegate next, ILogger<JwtValidationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IJwtService jwtService)
    {
        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

        // Kiểm tra nếu client gửi header Authorization (dù có chữ 'Bearer ' ở đầu hay chỉ dán thẳng chuỗi token)
        if (!string.IsNullOrWhiteSpace(authHeader))
        {
            var token = authHeader.Trim();
            if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = token["Bearer ".Length..].Trim();
            }

            if (string.IsNullOrWhiteSpace(token))
            {
                await ReturnUnauthorized(context, "Access token không được để trống.");
                return;
            }

            var principal = jwtService.ValidateToken(token);
            if (principal == null)
            {
                _logger.LogWarning("Phát hiện Token không hợp lệ hoặc đã bị chỉnh sửa: {TokenPreview}", token.Length > 20 ? token[..20] + "..." : token);
                await ReturnUnauthorized(context, "Access token không hợp lệ, chữ ký bị sai hoặc token đã bị sửa đổi/hết hạn.");
                return;
            }

            // Gán Principal đã thẩm định an toàn vào HttpContext
            context.User = principal;
        }

        await _next(context);
    }

    private static async Task ReturnUnauthorized(HttpContext context, string message)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";

        var response = ApiResponse<string>.Fail(message, StatusCodes.Status401Unauthorized);
        await context.Response.WriteAsJsonAsync(response);
    }
}
