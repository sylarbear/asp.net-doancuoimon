using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Product;

namespace TechnoStore.Application.Interfaces
{
    public interface IProductService
    {
        Task<ApiResponse<PaginatedResult<ProductDto>>> GetAllAsync(ProductFilterDto filter);
        Task<ApiResponse<ProductDto>> GetByIdAsync(int id);
        Task<ApiResponse<ProductDto>> CreateAsync(CreateProductDto dto);
        Task<ApiResponse<ProductDto>> UpdateAsync(int id, UpdateProductDto dto);
        Task<ApiResponse<string>> DeleteAsync(int id);
    }
}
