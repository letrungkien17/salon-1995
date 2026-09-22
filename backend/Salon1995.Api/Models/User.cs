using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("username")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("role_id")]
    public int RoleId { get; set; }

    [Column("employee_id")]
    public int? EmployeeId { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active";

    [Column("last_login")]
    public DateTime? LastLogin { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("RoleId")]
    public Role? Role { get; set; }

    [ForeignKey("EmployeeId")]
    public Employee? Employee { get; set; }
}

[Table("customers")]
public class Customer
{
    [Key]
    [Column("customer_id")]
    public int CustomerId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    [Column("phone")]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("email")]
    public string? Email { get; set; }

    [MaxLength(255)]
    [Column("password_hash")]
    public string? PasswordHash { get; set; }

    [Column("gender")]
    public string? Gender { get; set; }

    [Column("date_of_birth")]
    public DateOnly? DateOfBirth { get; set; }

    [MaxLength(255)]
    [Column("address")]
    public string? Address { get; set; }

    [Column("membership_level")]
    public string MembershipLevel { get; set; } = "Thường"; // 'Thường','Bạc','Vàng','Bạch kim'

    [Column("account_status")]
    public string AccountStatus { get; set; } = "Hoạt động"; // 'Chưa kích hoạt','Hoạt động','Khoá'

    [Column("is_phone_verified")]
    public bool IsPhoneVerified { get; set; } = false;

    [Column("is_email_verified")]
    public bool IsEmailVerified { get; set; } = false;

    [Column("last_login")]
    public DateTime? LastLogin { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("otp_verifications")]
public class OtpVerification
{
    [Key]
    [Column("otp_id")]
    public int OtpId { get; set; }

    [Column("customer_id")]
    public int CustomerId { get; set; }

    [Required]
    [MaxLength(10)]
    [Column("otp_code")]
    public string OtpCode { get; set; } = string.Empty;

    [Column("purpose")]
    public string Purpose { get; set; } = "Đăng ký"; // 'Đăng ký','Quên mật khẩu','Đổi SĐT','Đổi Email'

    [Column("channel")]
    public string Channel { get; set; } = "SMS"; // 'SMS','Email'

    [Column("is_used")]
    public bool IsUsed { get; set; } = false;

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("CustomerId")]
    public Customer? Customer { get; set; }
}
