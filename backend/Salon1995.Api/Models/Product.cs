using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("products")]
public class Product
{
    [Key]
    [Column("product_id")]
    public int ProductId { get; set; }

    [Required]
    [MaxLength(150)]
    [Column("product_name")]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Column("unit")]
    public string Unit { get; set; } = string.Empty;

    [Column("stock_quantity", TypeName = "decimal(10,2)")]
    public decimal StockQuantity { get; set; }

    [Column("unit_price", TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }

    [Column("branch_id")]
    public int BranchId { get; set; }

    [ForeignKey("BranchId")]
    public Branch? Branch { get; set; }
}

[Table("service_products")]
public class ServiceProduct
{
    [Column("service_id")]
    public int ServiceId { get; set; }

    [Column("product_id")]
    public int ProductId { get; set; }

    [Column("quantity_used", TypeName = "decimal(10,2)")]
    public decimal QuantityUsed { get; set; }

    [ForeignKey("ServiceId")]
    public Service? Service { get; set; }

    [ForeignKey("ProductId")]
    public Product? Product { get; set; }
}
