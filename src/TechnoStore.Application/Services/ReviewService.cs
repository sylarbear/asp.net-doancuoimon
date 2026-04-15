using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Review;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Enums;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IAppDbContext _db;

        public ReviewService(IAppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResponse<ProductReviewSummary>> GetProductReviewsAsync(int productId)
        {
            var reviews = await _db.Reviews
                .Where(r => r.ProductId == productId && r.IsActive)
                .ToListAsync();

            var summary = new ProductReviewSummary
            {
                AverageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0,
                TotalReviews = reviews.Count,
                RatingDistribution = new int[5]
            };

            for (int i = 1; i <= 5; i++)
                summary.RatingDistribution[i - 1] = reviews.Count(r => r.Rating == i);

            return ApiResponse<ProductReviewSummary>.SuccessResponse(summary);
        }

        public async Task<ApiResponse<List<ReviewDto>>> GetProductReviewListAsync(int productId)
        {
            var reviews = await _db.Reviews
                .Where(r => r.ProductId == productId && r.IsActive)
                .Include(r => r.User)
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ProductName = r.Product.Name,
                    UserId = r.UserId,
                    UserName = r.User.FullName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return ApiResponse<List<ReviewDto>>.SuccessResponse(reviews);
        }

        public async Task<ApiResponse<ReviewDto>> CreateReviewAsync(int userId, int productId, CreateReviewDto dto)
        {
            var product = await _db.Products.FindAsync(productId);
            if (product == null) return ApiResponse<ReviewDto>.ErrorResponse("San pham khong ton tai");

            var hasPurchased = await _db.OrderDetails
                .Include(od => od.Order)
                .AnyAsync(od => od.ProductId == productId
                    && od.Order.UserId == userId
                    && od.Order.Status == OrderStatus.Completed);

            if (!hasPurchased)
                return ApiResponse<ReviewDto>.ErrorResponse("Ban chi co the danh gia san pham da mua va nhan hang thanh cong");

            var existingReview = await _db.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);

            if (existingReview != null)
                return ApiResponse<ReviewDto>.ErrorResponse("Ban da danh gia san pham nay roi");

            var user = await _db.Users.FindAsync(userId);

            var review = new Review
            {
                ProductId = productId,
                UserId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();

            return ApiResponse<ReviewDto>.SuccessResponse(new ReviewDto
            {
                Id = review.Id,
                ProductId = review.ProductId,
                ProductName = product.Name,
                UserId = review.UserId,
                UserName = user!.FullName,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            }, "Danh gia thanh cong");
        }

        public async Task<ApiResponse<ReviewDto>> UpdateReviewAsync(int userId, int reviewId, UpdateReviewDto dto)
        {
            var review = await _db.Reviews
                .Include(r => r.Product)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            if (review == null) return ApiResponse<ReviewDto>.ErrorResponse("Danh gia khong ton tai");
            if (review.UserId != userId) return ApiResponse<ReviewDto>.ErrorResponse("Ban khong co quyen sua danh gia nay");

            if (dto.Rating.HasValue) review.Rating = dto.Rating.Value;
            if (dto.Comment != null) review.Comment = dto.Comment;

            await _db.SaveChangesAsync();

            return ApiResponse<ReviewDto>.SuccessResponse(new ReviewDto
            {
                Id = review.Id,
                ProductId = review.ProductId,
                ProductName = review.Product.Name,
                UserId = review.UserId,
                UserName = review.User.FullName,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            }, "Cap nhat danh gia thanh cong");
        }

        public async Task<ApiResponse<string>> DeleteReviewAsync(int reviewId)
        {
            var review = await _db.Reviews.FindAsync(reviewId);
            if (review == null) return ApiResponse<string>.ErrorResponse("Danh gia khong ton tai");

            review.IsActive = false;
            await _db.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse("Xoa danh gia thanh cong");
        }
    }
}


