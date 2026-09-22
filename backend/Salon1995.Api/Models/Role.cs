using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("roles")]
public class Role
{
    [Key]
    [Column("role_id")]
    public int RoleId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("role_name")]
    public string RoleName { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("description")]
    public string? Description { get; set; }
}

[Table("permissions")]
public class Permission
{
    [Key]
    [Column("permission_id")]
    public int PermissionId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("permission_code")]
    public string PermissionCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [Column("module")]
    public string Module { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("description")]
    public string? Description { get; set; }
}

[Table("role_permissions")]
public class RolePermission
{
    [Column("role_id")]
    public int RoleId { get; set; }

    [Column("permission_id")]
    public int PermissionId { get; set; }

    [ForeignKey("RoleId")]
    public Role? Role { get; set; }

    [ForeignKey("PermissionId")]
    public Permission? Permission { get; set; }
}
