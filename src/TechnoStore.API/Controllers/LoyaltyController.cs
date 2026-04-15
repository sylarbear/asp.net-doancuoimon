using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechnoStore.Application.Interfaces;

namespace TechnoStore.API.Controllers
{
    [ApiController]
    [Route("api/loyalty")]
    public class LoyaltyController : ControllerBase
    {
        private readonly ILoyaltyService _loyaltyService;

        public LoyaltyController(ILoyaltyService loyaltyService)
        {
            _loyaltyService = loyaltyService;
        }

        [HttpGet("my-points")]
        [Authorize]
        public async Task<IActionResult> GetMyPoints()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _loyaltyService.GetMyPointsAsync(userId);
            return Ok(result);
        }

        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetHistory()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _loyaltyService.GetHistoryAsync(userId);
            return Ok(result);
        }
    }

    [ApiController]
    [Route("api/admin/loyalty")]
    [Authorize(Roles = "Admin")]
    public class AdminLoyaltyController : ControllerBase
    {
        private readonly ILoyaltyService _loyaltyService;

        public AdminLoyaltyController(ILoyaltyService loyaltyService)
        {
            _loyaltyService = loyaltyService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result = await _loyaltyService.GetStatsAsync();
            return Ok(result);
        }

        [HttpGet("members")]
        public async Task<IActionResult> GetMembers([FromQuery] string? tier)
        {
            var result = await _loyaltyService.GetMembersAsync(tier);
            return Ok(result);
        }
    }
}
