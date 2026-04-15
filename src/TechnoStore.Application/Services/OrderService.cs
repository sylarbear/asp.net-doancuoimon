using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Order;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Enums;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILoyaltyService _loyaltyService;

        public OrderService(IUnitOfWork unitOfWork, ILoyaltyService loyaltyService)
        {
            _unitOfWork = unitOfWork;
            _loyaltyService = loyaltyService;
        }

        public async Task<ApiResponse<OrderDto>> CreateOrderAsync(int userId, CreateOrderDto dto)
        {
            // Lay gio hang
            var cartItems = await _unitOfWork.CartItems
                .Query()
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                .ToListAsync();

            if (!cartItems.Any())
                return ApiResponse<OrderDto>.ErrorResponse("Gio hang trong");

            // Kiem tra ton kho
            foreach (var item in cartItems)
            {
                if (!item.Product.IsActive)
                    return ApiResponse<OrderDto>.ErrorResponse($"San pham '{item.Product.Name}' khong con ban");
                if (item.Product.StockQuantity < item.Quantity)
                    return ApiResponse<OrderDto>.ErrorResponse($"San pham '{item.Product.Name}' chi con {item.Product.StockQuantity} trong kho");
            }

            // Tong tien truoc giam gia
            decimal totalAmount = cartItems.Sum(ci => ci.Product.Price * ci.Quantity);
            decimal discountAmount = 0;
            decimal memberDiscount = 0;
            string? voucherCode = null;

            // Ap dung voucher
            Voucher? appliedVoucher = null;
            if (!string.IsNullOrEmpty(dto.VoucherCode))
            {
                var voucher = await _unitOfWork.Vouchers.Query()
                    .FirstOrDefaultAsync(v => v.Code == dto.VoucherCode);
                if (voucher != null)
                {
                    var now = DateTime.UtcNow;
                    if (voucher.IsActive && voucher.StartDate <= now && voucher.EndDate >= now
                        && voucher.UsedCount < voucher.UsageLimit
                        && totalAmount >= voucher.MinOrderAmount)
                    {
                        discountAmount = VoucherService.CalculateDiscount(voucher, totalAmount);
                        voucherCode = voucher.Code;
                        voucher.UsedCount++;
                        appliedVoucher = voucher;
                        _unitOfWork.Vouchers.Update(voucher);
                    }
                }
            }

            // Ap dung giam gia hang thanh vien
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user != null)
            {
                decimal memberPercent = LoyaltyService.GetDiscountPercent(user.MembershipTier);
                if (memberPercent > 0)
                {
                    memberDiscount = (totalAmount - discountAmount) * memberPercent / 100;
                    // Max member discount 2,000,000
                    memberDiscount = Math.Min(memberDiscount, 2000000m);
                }
            }

            decimal finalAmount = totalAmount - discountAmount - memberDiscount;
            if (finalAmount < 0) finalAmount = 0;

            // Parse payment method
            var paymentMethod = dto.PaymentMethod?.ToLower() == "banktransfer"
                ? PaymentMethod.BankTransfer : PaymentMethod.COD;

            // Tao ma don hang
            var orderCode = $"TS-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

            // Points earned (based on final amount)
            int pointsEarned = (int)(finalAmount / 100000m);

            // Tao don hang
            var order = new Order
            {
                OrderCode = orderCode,
                UserId = userId,
                TotalAmount = totalAmount,
                VoucherCode = voucherCode,
                DiscountAmount = discountAmount,
                MemberDiscount = memberDiscount,
                FinalAmount = finalAmount,
                PointsEarned = pointsEarned,
                Status = OrderStatus.Pending,
                PaymentMethod = paymentMethod,
                PaymentStatus = paymentMethod == PaymentMethod.BankTransfer
                    ? PaymentStatus.Pending : PaymentStatus.Pending,
                ShippingAddress = dto.ShippingAddress,
                ReceiverName = dto.ReceiverName,
                ReceiverPhone = dto.ReceiverPhone,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // Save VoucherUsage after order is created
            if (appliedVoucher != null)
            {
                await _unitOfWork.VoucherUsages.AddAsync(new VoucherUsage
                {
                    VoucherId = appliedVoucher.Id,
                    UserId = userId,
                    OrderId = order.Id,
                    DiscountAmount = discountAmount,
                    UsedAt = DateTime.UtcNow
                });
                await _unitOfWork.SaveChangesAsync();
            }

            // Tao chi tiet don hang + tru ton kho
            var orderDetails = new List<OrderDetail>();
            foreach (var item in cartItems)
            {
                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    UnitPrice = item.Product.Price,
                    Quantity = item.Quantity,
                    SubTotal = item.Product.Price * item.Quantity
                };
                orderDetails.Add(detail);
                await _unitOfWork.OrderDetails.AddAsync(detail);

                // Tru ton kho
                item.Product.StockQuantity -= item.Quantity;
                _unitOfWork.Products.Update(item.Product);
            }

            // Xoa gio hang
            foreach (var item in cartItems)
                _unitOfWork.CartItems.Remove(item);

            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<OrderDto>.SuccessResponse(MapToOrderDto(order, orderDetails), "Dat hang thanh cong");
        }

        public async Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId)
        {
            var orders = await _unitOfWork.Orders
                .Query()
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderDetails)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var result = orders.Select(o => MapToOrderDto(o, o.OrderDetails.ToList())).ToList();
            return ApiResponse<List<OrderDto>>.SuccessResponse(result);
        }

        public async Task<ApiResponse<OrderDto>> GetOrderByIdAsync(int userId, int orderId)
        {
            var order = await _unitOfWork.Orders
                .Query()
                .Where(o => o.Id == orderId && o.UserId == userId)
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync();

            if (order == null)
                return ApiResponse<OrderDto>.ErrorResponse("Khong tim thay don hang");

            return ApiResponse<OrderDto>.SuccessResponse(MapToOrderDto(order, order.OrderDetails.ToList()));
        }

        public async Task<ApiResponse<string>> CancelOrderAsync(int userId, int orderId)
        {
            var order = await _unitOfWork.Orders
                .Query()
                .Where(o => o.Id == orderId && o.UserId == userId)
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync();

            if (order == null)
                return ApiResponse<string>.ErrorResponse("Khong tim thay don hang");

            if (order.Status != OrderStatus.Pending)
                return ApiResponse<string>.ErrorResponse("Chi co the huy don hang dang cho xu ly");

            order.Status = OrderStatus.Cancelled;
            order.UpdatedAt = DateTime.UtcNow;

            // Hoan lai ton kho
            foreach (var detail in order.OrderDetails)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(detail.ProductId);
                if (product != null)
                {
                    product.StockQuantity += detail.Quantity;
                    _unitOfWork.Products.Update(product);
                }
            }

            _unitOfWork.Orders.Update(order);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse("Da huy don hang");
        }

        // ===== ADMIN =====

        public async Task<ApiResponse<List<OrderDto>>> GetAllOrdersAsync()
        {
            var orders = await _unitOfWork.Orders
                .Query()
                .Include(o => o.OrderDetails)
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var result = orders.Select(o =>
            {
                var dto = MapToOrderDto(o, o.OrderDetails.ToList());
                dto.CustomerName = o.User.FullName;
                dto.CustomerEmail = o.User.Email;
                return dto;
            }).ToList();

            return ApiResponse<List<OrderDto>>.SuccessResponse(result);
        }

        public async Task<ApiResponse<OrderDto>> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto dto)
        {
            var order = await _unitOfWork.Orders
                .Query()
                .Include(o => o.OrderDetails)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                return ApiResponse<OrderDto>.ErrorResponse("Khong tim thay don hang");

            if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
                return ApiResponse<OrderDto>.ErrorResponse("Trang thai khong hop le. Cac trang thai: Pending, Confirmed, Shipping, Delivered, Completed, Cancelled");

            // Validate status transition
            var validTransitions = new Dictionary<OrderStatus, OrderStatus[]>
            {
                { OrderStatus.Pending, new[] { OrderStatus.Confirmed, OrderStatus.Cancelled } },
                { OrderStatus.Confirmed, new[] { OrderStatus.Shipping, OrderStatus.Cancelled } },
                { OrderStatus.Shipping, new[] { OrderStatus.Delivered } },
                { OrderStatus.Delivered, new[] { OrderStatus.Completed } },
                { OrderStatus.Completed, Array.Empty<OrderStatus>() },
                { OrderStatus.Cancelled, Array.Empty<OrderStatus>() }
            };

            if (!validTransitions.ContainsKey(order.Status) ||
                !validTransitions[order.Status].Contains(newStatus))
            {
                return ApiResponse<OrderDto>.ErrorResponse(
                    $"Khong the chuyen tu '{order.Status}' sang '{newStatus}'");
            }

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            // COD: Khi Delivered -> Paid
            if (newStatus == OrderStatus.Delivered && order.PaymentMethod == PaymentMethod.COD)
                order.PaymentStatus = PaymentStatus.Paid;

            // Completed -> Tich diem loyalty
            if (newStatus == OrderStatus.Completed)
            {
                await _loyaltyService.AddPointsAsync(order.UserId, order.Id, order.FinalAmount);
            }

            // Cancelled -> Hoan ton kho
            if (newStatus == OrderStatus.Cancelled)
            {
                foreach (var detail in order.OrderDetails)
                {
                    var product = await _unitOfWork.Products.GetByIdAsync(detail.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity += detail.Quantity;
                        _unitOfWork.Products.Update(product);
                    }
                }
            }

            _unitOfWork.Orders.Update(order);
            await _unitOfWork.SaveChangesAsync();

            var result = MapToOrderDto(order, order.OrderDetails.ToList());
            result.CustomerName = order.User.FullName;
            result.CustomerEmail = order.User.Email;

            return ApiResponse<OrderDto>.SuccessResponse(result, $"Da cap nhat trang thai thanh '{newStatus}'");
        }

        private static OrderDto MapToOrderDto(Order order, List<OrderDetail> details)
        {
            return new OrderDto
            {
                Id = order.Id,
                OrderCode = order.OrderCode,
                TotalAmount = order.TotalAmount,
                VoucherCode = order.VoucherCode,
                DiscountAmount = order.DiscountAmount,
                MemberDiscount = order.MemberDiscount,
                FinalAmount = order.FinalAmount,
                PointsEarned = order.PointsEarned,
                Status = order.Status.ToString(),
                PaymentMethod = order.PaymentMethod.ToString(),
                PaymentStatus = order.PaymentStatus.ToString(),
                ShippingAddress = order.ShippingAddress,
                ReceiverName = order.ReceiverName,
                ReceiverPhone = order.ReceiverPhone,
                Note = order.Note,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                OrderDetails = details.Select(d => new OrderDetailDto
                {
                    ProductId = d.ProductId,
                    ProductName = d.ProductName,
                    UnitPrice = d.UnitPrice,
                    Quantity = d.Quantity,
                    SubTotal = d.SubTotal
                }).ToList()
            };
        }
    }
}


