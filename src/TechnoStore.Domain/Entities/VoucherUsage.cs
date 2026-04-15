using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnoStore.Domain.Entities
{
    public class VoucherUsage
    {
        public int Id { get; set; }

        public int VoucherId { get; set; }
        public int UserId { get; set; }
        public int OrderId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; }

        public DateTime UsedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual Voucher Voucher { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual Order Order { get; set; } = null!;
    }
}
