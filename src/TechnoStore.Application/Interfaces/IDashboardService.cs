using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Dashboard;

namespace TechnoStore.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<ApiResponse<DashboardOverviewDto>> GetOverviewAsync();
        Task<ApiResponse<List<RevenueReportDto>>> GetRevenueReportAsync(string period, DateTime? startDate, DateTime? endDate);
        Task<ApiResponse<List<TopItemDto>>> GetTopProductsAsync(int count = 5);
        Task<ApiResponse<List<TopItemDto>>> GetTopCustomersAsync(int count = 5);
        Task<ApiResponse<List<OrderStatsDto>>> GetOrderStatsAsync();
    }
}
