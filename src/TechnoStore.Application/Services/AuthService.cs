using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Auth;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthService(IUnitOfWork unitOfWork, IJwtTokenService jwtTokenService)
        {
            _unitOfWork = unitOfWork;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _unitOfWork.Users
                .Query()
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email đã được sử dụng");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Phone = dto.Phone,
                Address = dto.Address,
                Role = "Customer",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            var token = _jwtTokenService.GenerateToken(user);

            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role
            }, "Đăng ký thành công");
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto)
        {
            var user = await _unitOfWork.Users
                .Query()
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email hoặc mật khẩu không đúng");

            if (!user.IsActive)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Tài khoản đã bị khóa");

            var token = _jwtTokenService.GenerateToken(user);

            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role
            }, "Đăng nhập thành công");
        }

        public async Task<ApiResponse<UserProfileDto>> GetProfileAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return ApiResponse<UserProfileDto>.ErrorResponse("Không tìm thấy người dùng");

            return ApiResponse<UserProfileDto>.SuccessResponse(new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        public async Task<ApiResponse<UserProfileDto>> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return ApiResponse<UserProfileDto>.ErrorResponse("Không tìm thấy người dùng");

            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.Address = dto.Address;

            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<UserProfileDto>.SuccessResponse(new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            }, "Cập nhật thành công");
        }

        public async Task<ApiResponse<string>> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return ApiResponse<string>.ErrorResponse("Không tìm thấy người dùng");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return ApiResponse<string>.ErrorResponse("Mật khẩu hiện tại không đúng");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse("Đổi mật khẩu thành công");
        }
    }
}
