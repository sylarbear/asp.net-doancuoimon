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

        public OrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<OrderDto>> CreateOrderAsync(int userId, CreateOrderDto dto)
        {
            // Lấy giỏ hàng
            var cartItems = await _unitOfWork.CartItems
                .Query()
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                .ToListAsync();

            if (!cartItems.Any())
                return ApiResponse<OrderDto>.ErrorResponse("Giỏ hàng trống");

            // Kiểm tra tồn kho
            foreach (var item in cartItems)
            {
                if (!item.Product.IsActive)
                    return ApiResponse<OrderDto>.ErrorResponse($"Sản phẩm '{item.Product.Name}' không còn bán");
                if (item.Product.StockQuantity < item.Quantity)
                    return ApiResponse<OrderDto>.ErrorResponse($"Sản phẩm '{item.Product.Name}' chỉ còn {item.Product.StockQuantity} trong kho");
            }

            // Tạo mã đơn hàng
            var orderCode = $"TS-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

            // Tạo đơn hàng
            var order = new Order
            {
                OrderCode = orderCode,
                UserId = userId,
                TotalAmount = cartItems.Sum(ci => ci.Product.Price * ci.Quantity),
                Status = OrderStatus.Pending,
                PaymentMethod = PaymentMethod.COD,
                PaymentStatus = PaymentStatus.Pending,
                ShippingAddress = dto.ShippingAddress,
                ReceiverName = dto.ReceiverName,
                ReceiverPhone = dto.ReceiverPhone,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // Tạo chi tiết đơn hàng + trừ tồn kho
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

                // Trừ tồn kho
                item.Product.StockQuantity -= item.Quantity;
                _unitOfWork.Products.Update(item.Product);
            }

            // Xóa giỏ hàng
            foreach (var item in cartItems)
                _unitOfWork.CartItems.Remove(item);

            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<OrderDto>.SuccessResponse(MapToOrderDto(order, orderDetails), "Đặt hàng thành công");
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
                return ApiResponse<OrderDto>.ErrorResponse("Không tìm thấy đơn hàng");

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
                return ApiResponse<string>.ErrorResponse("Không tìm thấy đơn hàng");

            if (order.Status != OrderStatus.Pending)
                return ApiResponse<string>.ErrorResponse("Chỉ có thể hủy đơn hàng đang chờ xử lý");

            order.Status = OrderStatus.Cancelled;
            order.UpdatedAt = DateTime.UtcNow;

            // Hoàn lại tồn kho
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

            return ApiResponse<string>.SuccessResponse("Đã hủy đơn hàng");
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
                return ApiResponse<OrderDto>.ErrorResponse("Không tìm thấy đơn hàng");

            if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
                return ApiResponse<OrderDto>.ErrorResponse("Trạng thái không hợp lệ. Các trạng thái: Pending, Confirmed, Shipping, Delivered, Completed, Cancelled");

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
                    $"Không thể chuyển từ '{order.Status}' sang '{newStatus}'");
            }

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            // COD: Khi Delivered → Paid
            if (newStatus == OrderStatus.Delivered && order.PaymentMethod == PaymentMethod.COD)
                order.PaymentStatus = PaymentStatus.Paid;

            // Cancelled → Hoàn tồn kho
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

            return ApiResponse<OrderDto>.SuccessResponse(result, $"Đã cập nhật trạng thái thành '{newStatus}'");
        }

        private static OrderDto MapToOrderDto(Order order, List<OrderDetail> details)
        {
            return new OrderDto
            {
                Id = order.Id,
                OrderCode = order.OrderCode,
                TotalAmount = order.TotalAmount,
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
