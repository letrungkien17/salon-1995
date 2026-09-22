using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("branches")]
public class Branch
{
    [Key]
    [Column("branch_id")]
    public int BranchId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("branch_name")]
    public string BranchName { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [Column("address")]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    [Column("phone")]
    public string Phone { get; set; } = string.Empty;

    [Column("opening_time")]
    public TimeSpan OpeningTime { get; set; } = new TimeSpan(8, 0, 0);

    [Column("closing_time")]
    public TimeSpan ClosingTime { get; set; } = new TimeSpan(20, 0, 0);

    [Column("status")]
    public string Status { get; set; } = "active";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
