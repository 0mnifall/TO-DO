using backend.Dto.Task;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public class TaskRepository(AppDbContext context) : ITaskRepository
{
    public async Task AddTask(TodoTask task)
    {
        context.Tasks.Add(task);
        await context.SaveChangesAsync();
    }

    public async Task<User> GetUser(int userId)
    {
        return (await context.Users.FindAsync(userId))!;
    }

    public async Task<Category?> GetCategory(int categoryId)
    {
        return await context.Categories.FindAsync(categoryId);
    }

    public async Task<IEnumerable<TaskPreviewDto>> GetAllUserTasks(int userId)
    {
        return await context.Tasks
            .Where(t => t.UserId == userId)
            .Select(t => new TaskPreviewDto
            {
                Title = t.Title,
                IsCompleted = t.IsCompleted,
                Priority = t.Priority,
                Category = t.Category,
                DisplayedDate = t.IsCompleted ? t.CompletedAt : t.DueDate
            })
            .ToListAsync();
    }

    public async Task<TaskDto?> GetTaskDto(int id, int userId)
    {
        return await context.Tasks
            .Where(t => t.Id == id)
            .Select(t => new TaskDto
            {
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt,
                Priority = t.Priority,
                Category = t.Category,
                DisplayedDate = t.IsCompleted ? t.CompletedAt : t.DueDate
            })
            .FirstOrDefaultAsync();
    }

    public async Task<TodoTask?> GetTask(int id, int userId)
    {
        return await context.Tasks.FindAsync(id);
    }

    public async Task UpdateTask(TodoTask task)
    {
        context.Tasks.Update(task);
        await context.SaveChangesAsync();
    }

    public Task Delete(TodoTask task)
    {
        context.Tasks.Remove(task);
        return context.SaveChangesAsync();
    }
}