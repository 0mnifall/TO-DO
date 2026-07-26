using backend.Dto.Auth;
using backend.Models;

namespace backend.Data.Repositories;

public interface IUserRepository
{
    Task<bool> IsExist(string email);
    Task AddUser(User user);
    Task<AuthRequest?> FindUserForLogin(string email);
    Task UpdateToken(string email,  string token);
    Task<AuthRequest?> FindUserByToken(string email);
    Task DeleteUser(User user);
    Task ClearRefresh(int userId);
}