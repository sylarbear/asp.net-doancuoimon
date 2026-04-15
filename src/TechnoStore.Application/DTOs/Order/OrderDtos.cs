using System.ComponentModel.DataAnnotations;

namespace TechnoStore.Application.DTOs.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderCode { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string? VoucherCode { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal MemberDiscount { get; set; }
        public decimal FinalAmount { get; set; }
        public int PointsEarned { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverPhone { get; set; } = string.Empty;
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; } = new();

        // Customer info (for admin view)
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
    }

    public class OrderDetailDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal SubTotal { get; set; }
    }

    public class CreateOrderDto
    {
        [Required(ErrorMessage = "Địa chỉ giao hàng là bắt buộc")]
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên người nhận là bắt buộc")]
        [MaxLength(100)]
        public string ReceiverName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại người nhận là bắt buộc")]
        [MaxLength(20)]
        public string ReceiverPhone { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Note { get; set; }

        public string PaymentMethod { get; set; } = "COD"; // COD or BankTransfer

        [MaxLength(50)]
        public string? VoucherCode { get; set; }
    }

    public class UpdateOrderStatusDto
    {
        [Required(ErrorMessage = "Trạng thái là bắt buộc")]
        public string Status { get; set; } = string.Empty;
    }
}
