using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Cart;

namespace TechnoStore.Application.Interfaces
{
    public interface ICartService
    {
        Task<ApiResponse<CartDto>> GetCartAsync(int userId);
        Task<ApiResponse<CartItemDto>> AddToCartAsync(int userId, AddToCartDto dto);
        Task<ApiResponse<CartItemDto>> UpdateCartItemAsync(int userId, int itemId, UpdateCartItemDto dto);
        Task<ApiResponse<string>> RemoveCartItemAsync(int userId, int itemId);
        Task<ApiResponse<string>> ClearCartAsync(int userId);
    }
}
