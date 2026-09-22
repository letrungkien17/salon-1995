using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salon1995.Api.Models;

[Table("vouchers")]
public class Voucher
{
    [Key]
    [Column("voucher_id")]
    public int VoucherId { get; set; }

    [Required]
    [MaxLength(30)]
    [Column("voucher_code")]
    public string VoucherCode { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("description")]
    public string? Description { get; set; }

    [Required]
    [Column("discount_type")]
    public string DiscountType { get; set; } = "percent"; // 'percent','fixed'

    [Column("discount_value", TypeName = "decimal(10,2)")]
    public decimal DiscountValue { get; set; }

    [Column("start_date")]
    public DateOnly StartDate { get; set; }

    [Column("end_date")]
    public DateOnly EndDate { get; set; }

    [Column("usage_limit")]
    public int? UsageLimit { get; set; }

    [Column("used_count")]
    public int UsedCount { get; set; } = 0;

    [Column("status")]
    public string Status { get; set; } = "active";
}

[Table("bookings")]
public class Booking
{
    [Key]
    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("customer_id")]
    public int CustomerId { get; set; }

    [Column("branch_id")]
    public int BranchId { get; set; }

    [Column("booking_date")]
    public DateOnly BookingDate { get; set; }

    [Column("booking_time")]
    public TimeSpan BookingTime { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Chờ xác nhận"; // 'Chờ xác nhận','Đã xác nhận','Đang thực hiện','Hoàn thành','Đã huỷ','Không đến'

    [MaxLength(255)]
    [Column("note")]
    public string? Note { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("CustomerId")]
    public Customer? Customer { get; set; }

    [ForeignKey("BranchId")]
    public Branch? Branch { get; set; }

    public ICollection<BookingDetail>? BookingDetails { get; set; }
    public Payment? Payment { get; set; }
    public Review? Review { get; set; }
}

[Table("booking_details")]
public class BookingDetail
{
    [Key]
    [Column("booking_detail_id")]
    public int BookingDetailId { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("service_id")]
    public int ServiceId { get; set; }

    [Column("employee_id")]
    public int EmployeeId { get; set; }

    [Column("price", TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    [Column("start_time")]
    public TimeSpan? StartTime { get; set; }

    [Column("end_time")]
    public TimeSpan? EndTime { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Chờ"; // 'Chờ','Đang làm','Hoàn thành','Huỷ'

    [ForeignKey("BookingId")]
    public Booking? Booking { get; set; }

    [ForeignKey("ServiceId")]
    public Service? Service { get; set; }

    [ForeignKey("EmployeeId")]
    public Employee? Employee { get; set; }
}

[Table("payments")]
public class Payment
{
    [Key]
    [Column("payment_id")]
    public int PaymentId { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("voucher_id")]
    public int? VoucherId { get; set; }

    [Required]
    [Column("payment_method")]
    public string PaymentMethod { get; set; } = "Tiền mặt"; // 'Tiền mặt','Thẻ','Momo','Chuyển khoản','ZaloPay'

    [Column("total_amount", TypeName = "decimal(10,2)")]
    public decimal TotalAmount { get; set; }

    [Column("discount_amount", TypeName = "decimal(10,2)")]
    public decimal DiscountAmount { get; set; } = 0;

    [Column("final_amount", TypeName = "decimal(10,2)")]
    public decimal FinalAmount { get; set; }

    [Column("payment_status")]
    public string PaymentStatus { get; set; } = "Chưa thanh toán"; // 'Chưa thanh toán','Đã thanh toán','Đã hoàn tiền'

    [Column("payment_date")]
    public DateTime? PaymentDate { get; set; }

    [ForeignKey("BookingId")]
    public Booking? Booking { get; set; }

    [ForeignKey("VoucherId")]
    public Voucher? Voucher { get; set; }
}

[Table("reviews")]
public class Review
{
    [Key]
    [Column("review_id")]
    public int ReviewId { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("customer_id")]
    public int CustomerId { get; set; }

    [Range(1, 5)]
    [Column("rating")]
    public int Rating { get; set; }

    [MaxLength(500)]
    [Column("comment")]
    public string? Comment { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("BookingId")]
    public Booking? Booking { get; set; }

    [ForeignKey("CustomerId")]
    public Customer? Customer { get; set; }
}
