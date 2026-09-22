using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("services")]
public class Service
{
    [Key]
    [Column("service_id")]
    public int ServiceId { get; set; }

    [Column("category_id")]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(150)]
    [Column("service_name")]
    public string ServiceName { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("description")]
    public string? Description { get; set; }

    [Column("duration_minutes")]
    public int DurationMinutes { get; set; }

    [Column("price", TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active";

    [ForeignKey("CategoryId")]
    public ServiceCategory? Category { get; set; }
}
