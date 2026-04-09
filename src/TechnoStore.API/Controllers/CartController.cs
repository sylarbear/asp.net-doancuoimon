using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechnoStore.Application.DTOs.Cart;
using TechnoStore.Application.Interfaces;

namespace TechnoStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserId();
            var result = await _cartService.GetCartAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            var userId = GetUserId();
            var result = await _cartService.AddToCartAsync(userId, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{itemId}")]
        public async Task<IActionResult> UpdateCartItem(int itemId, [FromBody] UpdateCartItemDto dto)
        {
            var userId = GetUserId();
            var result = await _cartService.UpdateCartItemAsync(userId, itemId, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> RemoveCartItem(int itemId)
        {
            var userId = GetUserId();
            var result = await _cartService.RemoveCartItemAsync(userId, itemId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetUserId();
            var result = await _cartService.ClearCartAsync(userId);
            return Ok(result);
        }

        private int GetUserId()
            => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
