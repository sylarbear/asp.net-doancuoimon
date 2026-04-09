using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Cart;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class CartService : ICartService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CartService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<CartDto>> GetCartAsync(int userId)
        {
            var items = await _unitOfWork.CartItems
                .Query()
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                .Select(ci => new CartItemDto
                {
                    Id = ci.Id,
                    ProductId = ci.ProductId,
                    ProductName = ci.Product.Name,
                    ProductImageUrl = ci.Product.ImageUrl,
                    ProductPrice = ci.Product.Price,
                    Quantity = ci.Quantity,
                    SubTotal = ci.Product.Price * ci.Quantity
                })
                .ToListAsync();

            var cart = new CartDto
            {
                Items = items,
                TotalAmount = items.Sum(i => i.SubTotal),
                TotalItems = items.Sum(i => i.Quantity)
            };

            return ApiResponse<CartDto>.SuccessResponse(cart);
        }

        public async Task<ApiResponse<CartItemDto>> AddToCartAsync(int userId, AddToCartDto dto)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(dto.ProductId);
            if (product == null || !product.IsActive)
                return ApiResponse<CartItemDto>.ErrorResponse("Sản phẩm không tồn tại");

            if (product.StockQuantity < dto.Quantity)
                return ApiResponse<CartItemDto>.ErrorResponse($"Sản phẩm chỉ còn {product.StockQuantity} trong kho");

            // Kiểm tra đã có trong giỏ chưa
            var existingItem = await _unitOfWork.CartItems
                .Query()
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
                if (existingItem.Quantity > product.StockQuantity)
                    return ApiResponse<CartItemDto>.ErrorResponse($"Tổng số lượng vượt quá tồn kho ({product.StockQuantity})");

                _unitOfWork.CartItems.Update(existingItem);
            }
            else
            {
                existingItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.CartItems.AddAsync(existingItem);
            }

            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<CartItemDto>.SuccessResponse(new CartItemDto
            {
                Id = existingItem.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                ProductImageUrl = product.ImageUrl,
                ProductPrice = product.Price,
                Quantity = existingItem.Quantity,
                SubTotal = product.Price * existingItem.Quantity
            }, "Đã thêm vào giỏ hàng");
        }

        public async Task<ApiResponse<CartItemDto>> UpdateCartItemAsync(int userId, int itemId, UpdateCartItemDto dto)
        {
            var item = await _unitOfWork.CartItems
                .Query()
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.UserId == userId);

            if (item == null)
                return ApiResponse<CartItemDto>.ErrorResponse("Không tìm thấy sản phẩm trong giỏ");

            if (dto.Quantity > item.Product.StockQuantity)
                return ApiResponse<CartItemDto>.ErrorResponse($"Sản phẩm chỉ còn {item.Product.StockQuantity} trong kho");

            item.Quantity = dto.Quantity;
            _unitOfWork.CartItems.Update(item);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<CartItemDto>.SuccessResponse(new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                ProductImageUrl = item.Product.ImageUrl,
                ProductPrice = item.Product.Price,
                Quantity = item.Quantity,
                SubTotal = item.Product.Price * item.Quantity
            }, "Cập nhật giỏ hàng thành công");
        }

        public async Task<ApiResponse<string>> RemoveCartItemAsync(int userId, int itemId)
        {
            var item = await _unitOfWork.CartItems
                .Query()
                .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.UserId == userId);

            if (item == null)
                return ApiResponse<string>.ErrorResponse("Không tìm thấy sản phẩm trong giỏ");

            _unitOfWork.CartItems.Remove(item);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse("Đã xóa khỏi giỏ hàng");
        }

        public async Task<ApiResponse<string>> ClearCartAsync(int userId)
        {
            var items = await _unitOfWork.CartItems
                .FindAsync(ci => ci.UserId == userId);

            foreach (var item in items)
                _unitOfWork.CartItems.Remove(item);

            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse("Đã xóa toàn bộ giỏ hàng");
        }
    }
}
