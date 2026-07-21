using backend.Data.Repositories;
using backend.Dto.Task;
using backend.Models;

namespace backend.Services;

public class TaskService(ITaskRepository repository) : ITaskService
{
    public async Task CreateTask(CreateTaskDto dto, int userId)
    {
        var task = new TodoTask
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            UserId = userId,
            User = await repository.GetUser(userId),
            CategoryId = dto.CategoryId,
            Category = await repository.GetCategory(dto.CategoryId)
        };
        
        await repository.AddTask(task);
    }

    public async Task<IEnumerable<TaskPreviewDto>> GetAllUserTasks(int userId)
    {
        return await repository.GetAllUserTasks(userId);
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

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.DueDate = dto.DueDate;
        task.CategoryId = dto.CategoryId;
        task.Category = await repository.GetCategory(dto.CategoryId);

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
        
        task.Complete();
        return true;
    }

    public async Task<bool> ReopenTask(int id, int userId)
    {
        var task = await repository.GetTask(id, userId);
        
        if (task == null)
        {
            return false;
        }
        
        task.Reopen();
        return true;
    }
}