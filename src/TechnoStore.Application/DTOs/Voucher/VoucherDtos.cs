using System.ComponentModel.DataAnnotations;

namespace TechnoStore.Application.DTOs.Voucher
{
    public class VoucherDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string DiscountType { get; set; } = string.Empty;
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public int UsageLimit { get; set; }
        public int UsedCount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public int? PointsCost { get; set; }
    }

    public class CreateVoucherDto
    {
        [Required, MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public string DiscountType { get; set; } = "Percent"; // Percent or Fixed

        [Required, Range(0.01, double.MaxValue)]
        public decimal DiscountValue { get; set; }

        public decimal MinOrderAmount { get; set; } = 0;
        public decimal? MaxDiscountAmount { get; set; }

        [Range(1, int.MaxValue)]
        public int UsageLimit { get; set; } = 100;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public int? PointsCost { get; set; }
    }

    public class UpdateVoucherDto
    {
        [MaxLength(500)]
        public string? Description { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public int? UsageLimit { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? IsActive { get; set; }
    }

    public class ValidateVoucherDto
    {
        [Required]
        public string Code { get; set; } = string.Empty;
        public decimal OrderAmount { get; set; }
    }

    public class VoucherValidationResult
    {
        public bool IsValid { get; set; }
        public string? Message { get; set; }
        public decimal DiscountAmount { get; set; }
        public VoucherDto? Voucher { get; set; }
    }

    public class RedeemVoucherDto
    {
        [Required]
        public string VoucherCode { get; set; } = string.Empty;
    }
}
