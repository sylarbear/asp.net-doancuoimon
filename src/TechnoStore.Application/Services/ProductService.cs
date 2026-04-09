using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Product;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<PaginatedResult<ProductDto>>> GetAllAsync(ProductFilterDto filter)
        {
            var query = _unitOfWork.Products
                .Query()
                .Include(p => p.Category)
                .Where(p => p.IsActive)
                .AsQueryable();

            // 🔍 Tìm kiếm theo tên
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(search)
                    || p.Brand.ToLower().Contains(search));
            }

            // 📂 Lọc theo danh mục
            if (filter.CategoryId.HasValue)
                query = query.Where(p => p.CategoryId == filter.CategoryId.Value);

            // 🏷️ Lọc theo hãng
            if (!string.IsNullOrWhiteSpace(filter.Brand))
                query = query.Where(p => p.Brand.ToLower() == filter.Brand.ToLower());

            // 💰 Lọc theo giá
            if (filter.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filter.MinPrice.Value);
            if (filter.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);

            // Tổng số kết quả
            var totalCount = await query.CountAsync();

            // ↕️ Sắp xếp
            query = filter.SortBy?.ToLower() switch
            {
                "name" => filter.SortOrder?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Name)
                    : query.OrderBy(p => p.Name),
                "price" => filter.SortOrder?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Price)
                    : query.OrderBy(p => p.Price),
                _ => filter.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(p => p.CreatedAt)
                    : query.OrderByDescending(p => p.CreatedAt)
            };

            // 📄 Phân trang
            var page = Math.Max(1, filter.Page);
            var pageSize = Math.Clamp(filter.PageSize, 1, 50);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Brand = p.Brand,
                    Description = p.Description,
                    Price = p.Price,
                    StockQuantity = p.StockQuantity,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            var result = new PaginatedResult<ProductDto>
            {
                Data = products,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };

            return ApiResponse<PaginatedResult<ProductDto>>.SuccessResponse(result);
        }

        public async Task<ApiResponse<ProductDto>> GetByIdAsync(int id)
        {
            var product = await _unitOfWork.Products
                .Query()
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (product == null)
                return ApiResponse<ProductDto>.ErrorResponse("Không tìm thấy sản phẩm");

            return ApiResponse<ProductDto>.SuccessResponse(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Brand = product.Brand,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt
            });
        }

        public async Task<ApiResponse<ProductDto>> CreateAsync(CreateProductDto dto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(dto.CategoryId);
            if (category == null)
                return ApiResponse<ProductDto>.ErrorResponse("Danh mục không tồn tại");

            var product = new Product
            {
                Name = dto.Name,
                Brand = dto.Brand,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<ProductDto>.SuccessResponse(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Brand = product.Brand,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = category.Name,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt
            }, "Thêm sản phẩm thành công");
        }

        public async Task<ApiResponse<ProductDto>> UpdateAsync(int id, UpdateProductDto dto)
        {
            var product = await _unitOfWork.Products
                .Query()
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return ApiResponse<ProductDto>.ErrorResponse("Không tìm thấy sản phẩm");

            var category = await _unitOfWork.Categories.GetByIdAsync(dto.CategoryId);
            if (category == null)
                return ApiResponse<ProductDto>.ErrorResponse("Danh mục không tồn tại");

            product.Name = dto.Name;
            product.Brand = dto.Brand;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.ImageUrl = dto.ImageUrl;
            product.CategoryId = dto.CategoryId;
            product.IsActive = dto.IsActive;
            product.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Products.Update(product);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<ProductDto>.SuccessResponse(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Brand = product.Brand,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = category.Name,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt
            }, "Cập nhật sản phẩm thành công");
        }

        public async Task<ApiResponse<string>> DeleteAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
                return ApiResponse<string>.ErrorResponse("Không tìm thấy sản phẩm");

            // Soft delete
            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.Products.Update(product);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse("Xóa sản phẩm thành công");
        }
    }
}
