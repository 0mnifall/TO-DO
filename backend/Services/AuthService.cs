using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Data.Repositories;
using backend.Dto.Auth;
using backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public class AuthService(IUserRepository repository, IConfiguration configuration, IHttpContextAccessor accessor)
    : IAuthService
{
    public async Task<bool> IsExist(string email)
    {
        return await repository.IsExist(email);
    }

    public async Task Register(RegisterDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,

            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        await repository.AddUser(user);
    }

    public async Task<AuthRequest?> FindUser(string email)
    {
        return await repository.FindUserForLogin(email);
    }

    public Claim[] GetClaims(AuthRequest user)
    {
        return
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username)
        ];
    }

    public string GenerateJwtToken(AuthRequest user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: GetClaims(user),
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);

        return Convert.ToBase64String(randomNumber);
    }

    public bool Verify(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }

    public async Task<AuthResponse> Login(AuthRequest user)
    {
        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();
        
        await repository.UpdateToken(user.Email, refreshToken);

        return new AuthResponse
        {
            UserName = user.Username,
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<AuthRequest?> FindRefresh(string refreshToken)
    {
        return await repository.FindUserByToken(refreshToken);
    }

    public async Task UpdateRefreshToken(string email, string newRefreshToken)
    {
        await repository.UpdateToken(email, newRefreshToken);
    }

    public async Task Logout(int userId)
    {
        await repository.ClearRefresh(userId);
    }

    public async Task DeleteUser(User user)
    {
        await repository.DeleteUser(user);
    }
}