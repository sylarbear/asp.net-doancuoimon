using System.ComponentModel.DataAnnotations;

namespace TechnoStore.Application.DTOs.Review
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateReviewDto
    {
        [Required, Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(2000)]
        public string? Comment { get; set; }
    }

    public class UpdateReviewDto
    {
        [Range(1, 5)]
        public int? Rating { get; set; }

        [MaxLength(2000)]
        public string? Comment { get; set; }
    }

    public class ProductReviewSummary
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public int[] RatingDistribution { get; set; } = new int[5]; // [1star, 2star, 3star, 4star, 5star]
    }
}
