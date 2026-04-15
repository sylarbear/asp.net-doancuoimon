using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Dashboard;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Enums;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<DashboardOverviewDto>> GetOverviewAsync()
        {
            var completedOrders = _unitOfWork.Orders.Query()
                .Where(o => o.Status == OrderStatus.Completed);

            var overview = new DashboardOverviewDto
            {
                TotalRevenue = await completedOrders.SumAsync(o => o.FinalAmount),
                TotalOrders = await _unitOfWork.Orders.Query().CountAsync(),
                TotalCustomers = await _unitOfWork.Users.Query()
                    .CountAsync(u => u.Role == "Customer"),
                TotalProducts = await _unitOfWork.Products.Query()
                    .CountAsync(p => p.IsActive),
                PendingOrders = await _unitOfWork.Orders.Query()
                    .CountAsync(o => o.Status == OrderStatus.Pending)
            };

            return ApiResponse<DashboardOverviewDto>.SuccessResponse(overview);
        }

        public async Task<ApiResponse<List<RevenueReportDto>>> GetRevenueReportAsync(
            string period, DateTime? startDate, DateTime? endDate)
        {
            var query = _unitOfWork.Orders.Query()
                .Where(o => o.Status == OrderStatus.Completed);

            if (startDate.HasValue)
                query = query.Where(o => o.CreatedAt >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(o => o.CreatedAt <= endDate.Value);

            // Load filtered data to memory for GroupBy (EF Core can't translate .Date/.ToString)
            var orders = await query
                .Select(o => new { o.CreatedAt, o.FinalAmount })
                .ToListAsync();

            List<RevenueReportDto> report;

            switch (period.ToLower())
            {
                case "month":
                    report = orders
                        .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
                        .Select(g => new RevenueReportDto
                        {
                            Date = $"{g.Key.Year}-{g.Key.Month:D2}",
                            Revenue = g.Sum(o => o.FinalAmount),
                            OrderCount = g.Count()
                        })
                        .OrderBy(r => r.Date)
                        .ToList();
                    break;

                default: // day
                    report = orders
                        .GroupBy(o => o.CreatedAt.Date)
                        .Select(g => new RevenueReportDto
                        {
                            Date = g.Key.ToString("yyyy-MM-dd"),
                            Revenue = g.Sum(o => o.FinalAmount),
                            OrderCount = g.Count()
                        })
                        .OrderBy(r => r.Date)
                        .ToList();
                    break;
            }

            return ApiResponse<List<RevenueReportDto>>.SuccessResponse(report);
        }

        public async Task<ApiResponse<List<TopItemDto>>> GetTopProductsAsync(int count = 5)
        {
            var topProducts = await _unitOfWork.OrderDetails.Query()
                .Include(od => od.Order)
                .Where(od => od.Order.Status == OrderStatus.Completed)
                .GroupBy(od => new { od.ProductId, od.ProductName })
                .Select(g => new TopItemDto
                {
                    Id = g.Key.ProductId,
                    Name = g.Key.ProductName,
                    TotalAmount = g.Sum(od => od.SubTotal),
                    TotalQuantity = g.Sum(od => od.Quantity)
                })
                .OrderByDescending(t => t.TotalQuantity)
                .Take(count)
                .ToListAsync();

            return ApiResponse<List<TopItemDto>>.SuccessResponse(topProducts);
        }

        public async Task<ApiResponse<List<TopItemDto>>> GetTopCustomersAsync(int count = 5)
        {
            var topCustomers = await _unitOfWork.Orders.Query()
                .Where(o => o.Status == OrderStatus.Completed)
                .Include(o => o.User)
                .GroupBy(o => new { o.UserId, o.User.FullName })
                .Select(g => new TopItemDto
                {
                    Id = g.Key.UserId,
                    Name = g.Key.FullName,
                    TotalAmount = g.Sum(o => o.FinalAmount),
                    TotalQuantity = g.Count()
                })
                .OrderByDescending(t => t.TotalAmount)
                .Take(count)
                .ToListAsync();

            return ApiResponse<List<TopItemDto>>.SuccessResponse(topCustomers);
        }

        public async Task<ApiResponse<List<OrderStatsDto>>> GetOrderStatsAsync()
        {
            var orders = await _unitOfWork.Orders.Query()
                .GroupBy(o => o.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var stats = orders.Select(o => new OrderStatsDto
            {
                Status = o.Status.ToString(),
                Count = o.Count
            }).ToList();

            return ApiResponse<List<OrderStatsDto>>.SuccessResponse(stats);
        }
    }
}


