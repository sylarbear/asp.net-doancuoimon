using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Category;

namespace TechnoStore.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse<List<CategoryDto>>> GetAllAsync();
        Task<ApiResponse<CategoryDto>> GetByIdAsync(int id);
        Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto dto);
        Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto);
        Task<ApiResponse<string>> DeleteAsync(int id);
    }
}
