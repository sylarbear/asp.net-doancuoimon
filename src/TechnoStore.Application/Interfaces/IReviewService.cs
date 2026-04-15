using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Review;

namespace TechnoStore.Application.Interfaces
{
    public interface IReviewService
    {
        Task<ApiResponse<ProductReviewSummary>> GetProductReviewsAsync(int productId);
        Task<ApiResponse<List<ReviewDto>>> GetProductReviewListAsync(int productId);
        Task<ApiResponse<ReviewDto>> CreateReviewAsync(int userId, int productId, CreateReviewDto dto);
        Task<ApiResponse<ReviewDto>> UpdateReviewAsync(int userId, int reviewId, UpdateReviewDto dto);
        Task<ApiResponse<string>> DeleteReviewAsync(int reviewId);
    }
}
