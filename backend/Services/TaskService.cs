using backend.Data.Repositories;
using backend.Dto.Task;
using backend.Models;

namespace backend.Services;

public class TaskService(ITaskRepository repository) : ITaskService
{
    public async Task CreateTask(CreateTaskDto dto, int userId)
    {
        Category? category = null;
        if (dto.CategoryId != null)
        {
            category = await repository.GetCategory(dto.CategoryId.Value);
        }
        
        var task = new TodoTask
        {
            UserId = userId,
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            User = await repository.GetUser(userId),
            CategoryId = category?.Id,
            Category = category
        };
        
        await repository.AddTask(task);
    }

    public async Task<PagedResult> GetAllUserTasks(TaskQueryDto query, int userId)
    {
        return await repository.GetAllUserTasks(query, userId);
    }

    public async Task<TaskDto?> GetTaskById(int taskId, int userId)
    {
        return await repository.GetTaskDto(taskId, userId);
    }

    public async Task<bool> UpdateTask(int id, TaskPutDto dto, int userId)
    {
        var task = await repository.GetTask(id, userId);

        if (task == null)
        {
            return false;
        }
        
        Category? category = null;
        if (dto.CategoryId != null)
        {
            category = await repository.GetCategory(dto.CategoryId.Value);
        }

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = dto.Priority;
        task.CategoryId = category?.Id;
        task.Category = category;

        await repository.UpdateTask(task);
        return true;
    }

    public async Task<bool> DeleteTask(int id, int userId)
    {
        var task = await repository.GetTask(id, userId);

        if (task == null)
        {
            return false;
        }
        
        await repository.Delete(task);
        return true;
    }

    public async Task<bool> CompleteTask(int id, int userId)
    {
        var task = await repository.GetTask(id, userId);
        
        if (task == null)
        {
            return false;
        }

        await repository.CompleteTask(task);
        return true;
    }

    public async Task<bool> ReopenTask(int id, int userId)
    {
        var task = await repository.GetTask(id, userId);
        
        if (task == null)
        {
            return false;
        }
        
        await repository.ReopenTask(task);
        return true;
    }
}