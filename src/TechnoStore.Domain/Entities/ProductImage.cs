using System.ComponentModel.DataAnnotations;

namespace TechnoStore.Domain.Entities
{
    public class ProductImage
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }

        // Navigation
        public virtual Product Product { get; set; } = null!;
    }
}
