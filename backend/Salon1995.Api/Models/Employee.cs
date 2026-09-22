using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("employees")]
public class Employee
{
    [Key]
    [Column("employee_id")]
    public int EmployeeId { get; set; }

    [Column("branch_id")]
    public int BranchId { get; set; }

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

    [Column("gender")]
    public string? Gender { get; set; }

    [Column("date_of_birth")]
    public DateOnly? DateOfBirth { get; set; }

    [Required]
    [Column("position")]
    public string Position { get; set; } = "Stylist"; // 'Stylist','KTV Gội đầu dưỡng sinh','Phụ tá','Lễ tân','Quản lý'

    [Column("hire_date")]
    public DateOnly HireDate { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active";

    [ForeignKey("BranchId")]
    public Branch? Branch { get; set; }

    public ICollection<EmployeeSkill>? Skills { get; set; }
}

[Table("employee_skills")]
public class EmployeeSkill
{
    [Column("employee_id")]
    public int EmployeeId { get; set; }

    [Column("service_id")]
    public int ServiceId { get; set; }

    [Column("skill_level")]
    public string SkillLevel { get; set; } = "Thành thạo"; // 'Mới','Thành thạo','Chuyên gia'

    [ForeignKey("EmployeeId")]
    public Employee? Employee { get; set; }

    [ForeignKey("ServiceId")]
    public Service? Service { get; set; }
}

[Table("work_shifts")]
public class WorkShift
{
    [Key]
    [Column("shift_id")]
    public int ShiftId { get; set; }

    [Column("employee_id")]
    public int EmployeeId { get; set; }

    [Column("branch_id")]
    public int BranchId { get; set; }

    [Column("work_date")]
    public DateOnly WorkDate { get; set; }

    [Column("start_time")]
    public TimeSpan StartTime { get; set; }

    [Column("end_time")]
    public TimeSpan EndTime { get; set; }

    [Column("status")]
    public string Status { get; set; } = "scheduled"; // 'scheduled','off','leave'

    [ForeignKey("EmployeeId")]
    public Employee? Employee { get; set; }

    [ForeignKey("BranchId")]
    public Branch? Branch { get; set; }
}
