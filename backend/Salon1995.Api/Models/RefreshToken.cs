using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("refresh_tokens")]
public class RefreshToken
{
    [Key]
    [Column("refresh_token_id")]
    public int RefreshTokenId { get; set; }

    [Column("user_id")]
    public int? UserId { get; set; }

    [Column("customer_id")]
    public int? CustomerId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("token")]
    public string Token { get; set; } = string.Empty;

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("is_revoked")]
    public bool IsRevoked { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("UserId")]
    public User? User { get; set; }

    [ForeignKey("CustomerId")]
    public Customer? Customer { get; set; }
}
