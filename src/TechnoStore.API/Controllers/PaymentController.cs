using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TechnoStore.Application.Common;
using TechnoStore.Domain.Enums;
using TechnoStore.Infrastructure.Data;

namespace TechnoStore.API.Controllers
{
    [ApiController]
    [Route("api/payment")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly TechnoStoreDbContext _db;

        public PaymentController(TechnoStoreDbContext db)
        {
            _db = db;
        }

        [HttpGet("{orderId}/pay")]
        public async Task<IActionResult> GetPaymentPage(int orderId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var order = await _db.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                return NotFound(ApiResponse<string>.ErrorResponse("Don hang khong ton tai"));

            if (order.PaymentMethod != PaymentMethod.BankTransfer)
                return BadRequest(ApiResponse<string>.ErrorResponse("Don hang nay thanh toan COD"));

            if (order.PaymentStatus == PaymentStatus.Paid)
                return BadRequest(ApiResponse<string>.ErrorResponse("Don hang nay da thanh toan"));

            return Ok(ApiResponse<object>.SuccessResponse(new
            {
                orderId = order.Id,
                orderCode = order.OrderCode,
                amount = order.FinalAmount,
                bank = "TechnoStore Bank",
                accountNumber = "9999-8888-7777",
                accountName = "CONG TY TECHNOSTORE",
                message = $"Thanh toan #{order.OrderCode}",
                status = "Cho thanh toan"
            }, "Thong tin thanh toan"));
        }

        [HttpPost("{orderId}/confirm")]
        public async Task<IActionResult> ConfirmPayment(int orderId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var order = await _db.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                return NotFound(ApiResponse<string>.ErrorResponse("Don hang khong ton tai"));

            if (order.PaymentMethod != PaymentMethod.BankTransfer)
                return BadRequest(ApiResponse<string>.ErrorResponse("Don hang nay thanh toan COD"));

            if (order.PaymentStatus == PaymentStatus.Paid)
                return BadRequest(ApiResponse<string>.ErrorResponse("Don hang nay da thanh toan roi"));

            order.PaymentStatus = PaymentStatus.Paid;
            order.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse("Thanh toan thanh cong! Don hang se duoc xu ly."));
        }
    }
}
