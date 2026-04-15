using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Category;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<CategoryDto>>> GetAllAsync()
        {
            var categories = await _unitOfWork.Categories
                .Query()
                .Include(c => c.Products)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    ProductCount = c.Products.Count(p => p.IsActive)
                })
                .ToListAsync();

            return ApiResponse<List<CategoryDto>>.SuccessResponse(categories);
        }

        public async Task<ApiResponse<CategoryDto>> GetByIdAsync(int id)
        {
            var category = await _unitOfWork.Categories
                .Query()
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return ApiResponse<CategoryDto>.ErrorResponse("Không tìm thấy danh mục");

            return ApiResponse<CategoryDto>.SuccessResponse(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                ProductCount = category.Products.Count(p => p.IsActive)
            });
        }

        public async Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto dto)
        {
            var exists = await _unitOfWork.Categories
                .Query()
                .AnyAsync(c => c.Name == dto.Name);

            if (exists)
                return ApiResponse<CategoryDto>.ErrorResponse("Tên danh mục đã tồn tại");

            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                IsActive = true
            };

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<CategoryDto>.SuccessResponse(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                ProductCount = 0
            }, "Tạo danh mục thành công");
        }

        public async Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
                return ApiResponse<CategoryDto>.ErrorResponse("Không tìm thấy danh mục");

            var nameExists = await _unitOfWork.Categories
                .Query()
                .AnyAsync(c => c.Name == dto.Name && c.Id != id);

            if (nameExists)
                return ApiResponse<CategoryDto>.ErrorResponse("Tên danh mục đã tồn tại");

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.IsActive = dto.IsActive;

            _unitOfWork.Categories.Update(category);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<CategoryDto>.SuccessResponse(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive
            }, "Cập nhật danh mục thành công");
        }

        public async Task<ApiResponse<string>> DeleteAsync(int id)
        {
            var category = await _unitOfWork.Categories
                .Query()
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return ApiResponse<string>.ErrorResponse("Không tìm thấy danh mục");

            if (category.Products.Any(p => p.IsActive))
                return ApiResponse<string>.ErrorResponse("Không thể xóa danh mục đang có sản phẩm");

            _unitOfWork.Categories.Remove(category);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse("Xóa danh mục thành công");
        }
    }
}


