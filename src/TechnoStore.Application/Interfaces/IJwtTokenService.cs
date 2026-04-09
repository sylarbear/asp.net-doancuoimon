using TechnoStore.Domain.Entities;

namespace TechnoStore.Application.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}
