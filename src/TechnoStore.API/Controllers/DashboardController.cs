using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechnoStore.Application.Interfaces;

namespace TechnoStore.API.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var result = await _dashboardService.GetOverviewAsync();
            return Ok(result);
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueReport(
            [FromQuery] string period = "day",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            var result = await _dashboardService.GetRevenueReportAsync(period, startDate, endDate);
            return Ok(result);
        }

        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts([FromQuery] int count = 5)
        {
            var result = await _dashboardService.GetTopProductsAsync(count);
            return Ok(result);
        }

        [HttpGet("top-customers")]
        public async Task<IActionResult> GetTopCustomers([FromQuery] int count = 5)
        {
            var result = await _dashboardService.GetTopCustomersAsync(count);
            return Ok(result);
        }

        [HttpGet("order-stats")]
        public async Task<IActionResult> GetOrderStats()
        {
            var result = await _dashboardService.GetOrderStatsAsync();
            return Ok(result);
        }
    }
}
