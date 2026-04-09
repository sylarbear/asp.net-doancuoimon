namespace TechnoStore.Application.DTOs.Dashboard
{
    public class DashboardOverviewDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalProducts { get; set; }
        public int PendingOrders { get; set; }
    }

    public class RevenueReportDto
    {
        public string Date { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
    }

    public class TopItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public int TotalQuantity { get; set; }
    }

    public class OrderStatsDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
