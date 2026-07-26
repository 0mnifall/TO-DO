using System.Security.Claims;
using backend.Dto.Auth;
using backend.Models;
namespace backend.Services;

public interface IAuthService
{
    string GenerateJwtToken(AuthRequest user);
    string GenerateRefreshToken();
    Task<bool> IsExist(string email);
    Task Register(RegisterDto dto);
    Task<AuthRequest?> FindUser(string email);
    bool Verify(string password, string passwordHash);
    Claim[] GetClaims(AuthRequest user);
    Task<AuthResponse> Login(AuthRequest user);
    Task<AuthRequest?> FindRefresh(string refreshToken);
    Task UpdateRefreshToken(string email, string newRefreshToken);
    Task DeleteUser(User user);
    Task Logout(int  userId);
}