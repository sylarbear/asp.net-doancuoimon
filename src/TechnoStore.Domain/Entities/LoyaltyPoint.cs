using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnoStore.Domain.Entities
{
    public class LoyaltyPoint
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int Points { get; set; }

        [Required, MaxLength(20)]
        public string Type { get; set; } = "Earned"; // Earned, Redeemed

        [MaxLength(500)]
        public string? Description { get; set; }

        public int? OrderId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual User User { get; set; } = null!;
        public virtual Order? Order { get; set; }
    }
}
