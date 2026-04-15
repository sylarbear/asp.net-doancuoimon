using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TechnoStore.Domain.Enums;

namespace TechnoStore.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }

        [Required, MaxLength(20)]
        public string OrderCode { get; set; } = string.Empty;

        public int UserId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // Discount fields
        [MaxLength(50)]
        public string? VoucherCode { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; } = 0; // Voucher discount

        [Column(TypeName = "decimal(18,2)")]
        public decimal MemberDiscount { get; set; } = 0; // Membership tier discount

        [Column(TypeName = "decimal(18,2)")]
        public decimal FinalAmount { get; set; } // = TotalAmount - DiscountAmount - MemberDiscount

        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.COD;
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        [Required, MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string ReceiverName { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string ReceiverPhone { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Note { get; set; }

        public int PointsEarned { get; set; } = 0; // Points earned from this order

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual User User { get; set; } = null!;
        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}

