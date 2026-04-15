using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechnoStore.Application.DTOs.Review;
using TechnoStore.Application.Interfaces;

namespace TechnoStore.API.Controllers
{
    [ApiController]
    [Route("api/products/{productId}/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet]
        public async Task<IActionResult> GetReviews(int productId)
        {
            var result = await _reviewService.GetProductReviewListAsync(productId);
            return Ok(result);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(int productId)
        {
            var result = await _reviewService.GetProductReviewsAsync(productId);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(int productId, [FromBody] CreateReviewDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _reviewService.CreateReviewAsync(userId, productId, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }

    [ApiController]
    [Route("api/reviews")]
    public class ReviewManagementController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewManagementController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateReviewDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _reviewService.UpdateReviewAsync(userId, id, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _reviewService.DeleteReviewAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
