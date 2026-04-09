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

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual User User { get; set; } = null!;
        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}
