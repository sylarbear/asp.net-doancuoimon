using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Voucher;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class VoucherService : IVoucherService
    {
        private readonly IAppDbContext _db;

        public VoucherService(IAppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResponse<List<VoucherDto>>> GetAvailableVouchersAsync()
        {
            var now = DateTime.UtcNow;
            var vouchers = await _db.Vouchers
                .Where(v => v.IsActive && v.StartDate <= now && v.EndDate >= now && v.UsedCount < v.UsageLimit)
                .Select(v => MapToDto(v))
                .ToListAsync();

            return ApiResponse<List<VoucherDto>>.SuccessResponse(vouchers);
        }

        public async Task<ApiResponse<VoucherValidationResult>> ValidateVoucherAsync(string code, decimal orderAmount)
        {
            var voucher = await _db.Vouchers.FirstOrDefaultAsync(v => v.Code == code);

            if (voucher == null)
                return ApiResponse<VoucherValidationResult>.SuccessResponse(new VoucherValidationResult
                { IsValid = false, Message = "Ma voucher khong ton tai" });

            var now = DateTime.UtcNow;
            if (!voucher.IsActive || voucher.StartDate > now || voucher.EndDate < now)
                return ApiResponse<VoucherValidationResult>.SuccessResponse(new VoucherValidationResult
                { IsValid = false, Message = "Voucher da het han hoac khong hoat dong" });

            if (voucher.UsedCount >= voucher.UsageLimit)
                return ApiResponse<VoucherValidationResult>.SuccessResponse(new VoucherValidationResult
                { IsValid = false, Message = "Voucher da het luot su dung" });

            if (orderAmount < voucher.MinOrderAmount)
                return ApiResponse<VoucherValidationResult>.SuccessResponse(new VoucherValidationResult
                { IsValid = false, Message = $"Don hang toi thieu {voucher.MinOrderAmount:N0} VND" });

            decimal discount = CalculateDiscount(voucher, orderAmount);

            return ApiResponse<VoucherValidationResult>.SuccessResponse(new VoucherValidationResult
            {
                IsValid = true,
                Message = "Voucher hop le",
                DiscountAmount = discount,
                Voucher = MapToDto(voucher)
            });
        }

        public async Task<ApiResponse<string>> RedeemVoucherByPointsAsync(int userId, string voucherCode)
        {
            var voucher = await _db.Vouchers.FirstOrDefaultAsync(v => v.Code == voucherCode);
            if (voucher == null)
                return ApiResponse<string>.ErrorResponse("Voucher khong ton tai");

            if (voucher.PointsCost == null || voucher.PointsCost <= 0)
                return ApiResponse<string>.ErrorResponse("Voucher nay khong the doi bang diem");

            var user = await _db.Users.FindAsync(userId);
            if (user == null) return ApiResponse<string>.ErrorResponse("User not found");

            if (user.TotalPoints < voucher.PointsCost)
                return ApiResponse<string>.ErrorResponse($"Khong du diem. Can {voucher.PointsCost} diem, ban co {user.TotalPoints} diem");

            user.TotalPoints -= voucher.PointsCost.Value;
            _db.LoyaltyPoints.Add(new LoyaltyPoint
            {
                UserId = userId,
                Points = -voucher.PointsCost.Value,
                Type = "Redeemed",
                Description = $"Doi voucher {voucherCode}",
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
            return ApiResponse<string>.SuccessResponse($"Doi voucher {voucherCode} thanh cong! Con lai {user.TotalPoints} diem");
        }

        public async Task<ApiResponse<VoucherDto>> CreateVoucherAsync(CreateVoucherDto dto)
        {
            if (await _db.Vouchers.AnyAsync(v => v.Code == dto.Code))
                return ApiResponse<VoucherDto>.ErrorResponse("Ma voucher da ton tai");

            var voucher = new Voucher
            {
                Code = dto.Code.ToUpper(),
                Description = dto.Description,
                DiscountType = dto.DiscountType,
                DiscountValue = dto.DiscountValue,
                MinOrderAmount = dto.MinOrderAmount,
                MaxDiscountAmount = dto.MaxDiscountAmount,
                UsageLimit = dto.UsageLimit,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                PointsCost = dto.PointsCost,
                IsActive = true
            };

            _db.Vouchers.Add(voucher);
            await _db.SaveChangesAsync();

            return ApiResponse<VoucherDto>.SuccessResponse(MapToDto(voucher), "Tao voucher thanh cong");
        }

        public async Task<ApiResponse<VoucherDto>> UpdateVoucherAsync(int id, UpdateVoucherDto dto)
        {
            var voucher = await _db.Vouchers.FindAsync(id);
            if (voucher == null) return ApiResponse<VoucherDto>.ErrorResponse("Voucher khong ton tai");

            if (dto.Description != null) voucher.Description = dto.Description;
            if (dto.MinOrderAmount.HasValue) voucher.MinOrderAmount = dto.MinOrderAmount.Value;
            if (dto.MaxDiscountAmount.HasValue) voucher.MaxDiscountAmount = dto.MaxDiscountAmount.Value;
            if (dto.UsageLimit.HasValue) voucher.UsageLimit = dto.UsageLimit.Value;
            if (dto.EndDate.HasValue) voucher.EndDate = dto.EndDate.Value;
            if (dto.IsActive.HasValue) voucher.IsActive = dto.IsActive.Value;

            await _db.SaveChangesAsync();
            return ApiResponse<VoucherDto>.SuccessResponse(MapToDto(voucher), "Cap nhat voucher thanh cong");
        }

        public async Task<ApiResponse<string>> DeleteVoucherAsync(int id)
        {
            var voucher = await _db.Vouchers.FindAsync(id);
            if (voucher == null) return ApiResponse<string>.ErrorResponse("Voucher khong ton tai");

            _db.Vouchers.Remove(voucher);
            await _db.SaveChangesAsync();
            return ApiResponse<string>.SuccessResponse("Xoa voucher thanh cong");
        }

        public static decimal CalculateDiscount(Voucher voucher, decimal orderAmount)
        {
            decimal discount;
            if (voucher.DiscountType == "Percent")
            {
                discount = orderAmount * voucher.DiscountValue / 100;
                if (voucher.MaxDiscountAmount.HasValue)
                    discount = Math.Min(discount, voucher.MaxDiscountAmount.Value);
            }
            else
            {
                discount = voucher.DiscountValue;
            }
            return Math.Min(discount, orderAmount);
        }

        private static VoucherDto MapToDto(Voucher v)
        {
            return new VoucherDto
            {
                Id = v.Id,
                Code = v.Code,
                Description = v.Description,
                DiscountType = v.DiscountType,
                DiscountValue = v.DiscountValue,
                MinOrderAmount = v.MinOrderAmount,
                MaxDiscountAmount = v.MaxDiscountAmount,
                UsageLimit = v.UsageLimit,
                UsedCount = v.UsedCount,
                StartDate = v.StartDate,
                EndDate = v.EndDate,
                IsActive = v.IsActive,
                PointsCost = v.PointsCost
            };
        }
    }
}


