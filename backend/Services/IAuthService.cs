using backend.Dto.Auth;
using backend.Models;
namespace backend.Services;

public interface IAuthService
{
    Task<bool> IsExist(string email);
    Task Register(RegisterDto dto);
    Task<AuthRequest?> FindUser(string email);
    bool Verify(string password, string passwordHash);
    Task<AuthResponse> Login(AuthRequest user);
    Task<AuthRequest?> FindRefresh(string refreshToken);
    Task DeleteUser(User user);
}