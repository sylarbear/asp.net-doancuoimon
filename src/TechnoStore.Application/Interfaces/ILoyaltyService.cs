using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Loyalty;

namespace TechnoStore.Application.Interfaces
{
    public interface ILoyaltyService
    {
        Task<ApiResponse<LoyaltyOverviewDto>> GetMyPointsAsync(int userId);
        Task<ApiResponse<List<LoyaltyHistoryDto>>> GetHistoryAsync(int userId);
        Task<ApiResponse<LoyaltyStatsDto>> GetStatsAsync();
        Task<ApiResponse<List<LoyaltyMemberDto>>> GetMembersAsync(string? tier);
        Task AddPointsAsync(int userId, int orderId, decimal orderAmount);
        Task UpdateMembershipTierAsync(int userId);
    }
}
