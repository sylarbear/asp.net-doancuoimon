using System.ComponentModel.DataAnnotations;

namespace TechnoStore.Domain.Entities
{
    public class Review
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public int UserId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(2000)]
        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        // Navigation
        public virtual Product Product { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
