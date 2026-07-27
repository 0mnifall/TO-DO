using backend.Dto.Task;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public class TaskRepository(AppDbContext context) : ITaskRepository
{
    public async Task AddTask(TodoTask task)
    {
        context.Tasks.Add(task);
        var user = task.User;
        user.Tasks.Add(task);
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

    public async Task<PagedResult> GetAllUserTasks(TaskQueryDto queryDto, int userId)
    {
        IQueryable<TodoTask> query = context.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == userId);

        if (!string.IsNullOrWhiteSpace(queryDto.Search))
        {
            string search = queryDto.Search.Trim().ToLower();

            query = query.Where(task =>
                task.Title.ToLower().Contains(search));
        }

        if (queryDto.IsCompleted.HasValue)
        {
            query = query.Where(task =>
                task.IsCompleted == queryDto.IsCompleted.Value);
        }

        if (queryDto.CategoryId.HasValue)
        {
            query = query.Where(task =>
                task.CategoryId == queryDto.CategoryId.Value);
        }
        
        int totalCount = await query.CountAsync();

        int totalPages = (int)Math.Ceiling(
            totalCount / (double)queryDto.PageSize
        );
        
        var items = await query.OrderByDescending(task => task.CreatedAt)
            .Skip((queryDto.Page - 1) * queryDto.PageSize)
            .Take(queryDto.PageSize)
            .Select(t => new TaskPreviewDto
            {
                Id = t.Id,
                Title = t.Title,
                IsCompleted = t.IsCompleted,
                Priority = t.Priority,
                Category = t.Category == null ? null : t.Category.Name,
                DisplayedDate = t.IsCompleted ? t.CompletedAt : t.DueDate
            })
            .ToListAsync();
        
        return new PagedResult
        {
            Items = items,
            Page = queryDto.Page,
            PageSize = queryDto.PageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
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
                Category = t.Category == null ? null : t.Category.Name,
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

    public async Task Delete(TodoTask task)
    {
        var user = await context.Users.FindAsync(task.UserId);
        user!.Tasks.Remove(task);
        context.Tasks.Remove(task);
        await context.SaveChangesAsync();
    }

    public async Task CompleteTask(TodoTask task)
    {
        task.Complete();
        await context.SaveChangesAsync();
    }

    public async Task ReopenTask(TodoTask task)
    {
        task.Reopen();
        await context.SaveChangesAsync();
    }
}
