using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Order;

namespace TechnoStore.Application.Interfaces
{
    public interface IOrderService
    {
        Task<ApiResponse<OrderDto>> CreateOrderAsync(int userId, CreateOrderDto dto);
        Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId);
        Task<ApiResponse<OrderDto>> GetOrderByIdAsync(int userId, int orderId);
        Task<ApiResponse<string>> CancelOrderAsync(int userId, int orderId);
        Task<ApiResponse<List<OrderDto>>> GetAllOrdersAsync(); // Admin
        Task<ApiResponse<OrderDto>> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto dto); // Admin
    }
}
