using System.Security.Claims;

namespace Salon1995.Api.Services;

public interface IJwtService
{
    string GenerateAccessToken(int userId, string username, string role, string fullName, string phone);
    string GenerateRefreshToken();
    string GenerateToken(int userId, string username, string role, string fullName, string phone);
    ClaimsPrincipal? ValidateToken(string token);
}
