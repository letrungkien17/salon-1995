using System.ComponentModel.DataAnnotations;

namespace Salon1995.Api.Models.DTOs;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập hoặc số điện thoại")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequestDto
{
    [Required(ErrorMessage = "Vui lòng nhập họ và tên")]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
    [RegularExpression(@"^(03|05|07|08|09)\d{8}$", ErrorMessage = "Số điện thoại di động Việt Nam không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)")]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có tối thiểu 6 ký tự")]
    public string Password { get; set; } = string.Empty;

    public string? Gender { get; set; }

    /// <summary>
    /// Vai trò người dùng: "Customer", "Staff", "Manager", "Admin", "Receptionist". Mặc định: "Customer".
    /// </summary>
    public string? Role { get; set; } = "Customer";
}

public class RegisterResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Role { get; set; } = "Customer";
    public string Message { get; set; } = "Đăng ký tài khoản thành công! Vui lòng sử dụng tài khoản này để đăng nhập.";
}

public class AuthResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserProfileDto User { get; set; } = new();

    // Hỗ trợ thuộc tính Token cho các client cũ tương thích
    public string Token => AccessToken;
}

public class RefreshTokenRequestDto
{
    [Required(ErrorMessage = "Vui lòng cung cấp Refresh Token")]
    public string RefreshToken { get; set; } = string.Empty;
}

public class RevokeTokenRequestDto
{
    [Required(ErrorMessage = "Vui lòng cung cấp Refresh Token để thu hồi")]
    public string RefreshToken { get; set; } = string.Empty;
}

public class UserProfileDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Role { get; set; } = "Customer"; // Admin, Staff, Manager, Customer
    public string? MembershipLevel { get; set; }
}
