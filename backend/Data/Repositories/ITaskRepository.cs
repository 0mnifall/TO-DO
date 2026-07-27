using backend.Dto.Task;
using backend.Models;

namespace backend.Data.Repositories;

public interface ITaskRepository
{
    Task AddTask(TodoTask task);
    Task<User> GetUser(int userId);
    Task<Category?> GetCategory(int categoryId);
    Task<PagedResult> GetAllUserTasks(TaskQueryDto query, int userId);
    Task<TaskDto?> GetTaskDto(int id, int userId);
    Task<TodoTask?> GetTask(int id, int userId);
    Task UpdateTask(TodoTask task);
    Task Delete(TodoTask task);
    Task CompleteTask(TodoTask task);
    Task ReopenTask(TodoTask task);
}