using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechnoStore.Application.DTOs.Voucher;
using TechnoStore.Application.Interfaces;

namespace TechnoStore.API.Controllers
{
    [ApiController]
    [Route("api/vouchers")]
    public class VouchersController : ControllerBase
    {
        private readonly IVoucherService _voucherService;

        public VouchersController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable()
        {
            var result = await _voucherService.GetAvailableVouchersAsync();
            return Ok(result);
        }

        [HttpPost("validate")]
        [Authorize]
        public async Task<IActionResult> Validate([FromBody] ValidateVoucherDto dto)
        {
            var result = await _voucherService.ValidateVoucherAsync(dto.Code, dto.OrderAmount);
            return Ok(result);
        }

        [HttpPost("redeem")]
        [Authorize]
        public async Task<IActionResult> Redeem([FromBody] RedeemVoucherDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _voucherService.RedeemVoucherByPointsAsync(userId, dto.VoucherCode);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }

    [ApiController]
    [Route("api/admin/vouchers")]
    [Authorize(Roles = "Admin")]
    public class AdminVouchersController : ControllerBase
    {
        private readonly IVoucherService _voucherService;

        public AdminVouchersController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVoucherDto dto)
        {
            var result = await _voucherService.CreateVoucherAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVoucherDto dto)
        {
            var result = await _voucherService.UpdateVoucherAsync(id, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _voucherService.DeleteVoucherAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
