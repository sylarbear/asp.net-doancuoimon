using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechnoStore.Application.DTOs.Order;
using TechnoStore.Application.Interfaces;

namespace TechnoStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // ===== CUSTOMER ENDPOINTS =====

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = GetUserId();
            var result = await _orderService.CreateOrderAsync(userId, dto);
            return result.Success ? CreatedAtAction(nameof(GetOrderById), new { id = result.Data!.Id }, result) : BadRequest(result);
        }

        [Authorize(Roles = "Customer")]
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserId();
            var result = await _orderService.GetUserOrdersAsync(userId);
            return Ok(result);
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userId = GetUserId();
            var result = await _orderService.GetOrderByIdAsync(userId, id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        [Authorize(Roles = "Customer")]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var userId = GetUserId();
            var result = await _orderService.CancelOrderAsync(userId, id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ===== ADMIN ENDPOINTS =====

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var result = await _orderService.GetAllOrdersAsync();
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var result = await _orderService.UpdateOrderStatusAsync(id, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        private int GetUserId()
            => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
