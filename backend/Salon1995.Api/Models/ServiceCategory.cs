using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("service_categories")]
public class ServiceCategory
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("category_name")]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("description")]
    public string? Description { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public ICollection<Service>? Services { get; set; }
}
