using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Voucher;

namespace TechnoStore.Application.Interfaces
{
    public interface IVoucherService
    {
        Task<ApiResponse<List<VoucherDto>>> GetAvailableVouchersAsync();
        Task<ApiResponse<VoucherValidationResult>> ValidateVoucherAsync(string code, decimal orderAmount);
        Task<ApiResponse<string>> RedeemVoucherByPointsAsync(int userId, string voucherCode);
        Task<ApiResponse<VoucherDto>> CreateVoucherAsync(CreateVoucherDto dto);
        Task<ApiResponse<VoucherDto>> UpdateVoucherAsync(int id, UpdateVoucherDto dto);
        Task<ApiResponse<string>> DeleteVoucherAsync(int id);
    }
}
