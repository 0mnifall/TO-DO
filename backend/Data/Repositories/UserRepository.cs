using backend.Dto.Auth;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    public async Task<bool> IsExist(string email)
    {
        return await context.Users.AnyAsync(x => x.Email == email);
    }

    public async Task AddUser(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }
    
    public async Task<AuthRequest?> FindUserForLogin(string email)
    {
        return await context.Users.Select(u => new AuthRequest
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            PasswordHash = u.PasswordHash
        }).FirstOrDefaultAsync(s => s.Email == email);
    }

    public async Task UpdateToken(string email,  string token)
    {
        await context.Users.Where(u => u.Email == email)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(u => u.RefreshToken, token)
                .SetProperty(u => u.Expires, DateTime.UtcNow.AddDays(7)));
        
        await context.SaveChangesAsync();
    }

    public async Task<AuthRequest?> FindUserByToken(string token)
    {
        return await context.Users
            .Where(u => u.RefreshToken == token &&
                        u.Expires > DateTime.UtcNow)
            .Select(u => new AuthRequest
            {
                Id = u.Id,
                Email = u.Email,
                Username = u.Username,
                PasswordHash = u.PasswordHash
            })
            .FirstOrDefaultAsync();
    }
    
    public async Task DeleteUser(User user)
    {
        context.Users.Remove(user);
        await context.SaveChangesAsync();
    }
    
    public async Task ClearRefresh(int userId)
    {
        await context.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(u => u.RefreshToken, (string?)null)
                .SetProperty(u => u.Expires, DateTime.MinValue));

        await context.SaveChangesAsync();
    }
}