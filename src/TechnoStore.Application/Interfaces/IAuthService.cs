using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Auth;

namespace TechnoStore.Application.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto);
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto);
        Task<ApiResponse<UserProfileDto>> GetProfileAsync(int userId);
        Task<ApiResponse<UserProfileDto>> UpdateProfileAsync(int userId, UpdateProfileDto dto);
        Task<ApiResponse<string>> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}
