using backend.Dto.Task;

namespace backend.Services;

public interface ITaskService
{
    Task CreateTask(CreateTaskDto task, int userId);
    Task<IEnumerable<TaskPreviewDto>> GetAllUserTasks(int userId);
    Task<TaskDto?> GetTaskById(int taskId, int userId);
    Task<bool> UpdateTask(int id, TaskPutDto dto, int userId);
    Task<bool> DeleteTask(int id, int userId);
    Task<bool> CompleteTask(int id, int userId);
    Task<bool> ReopenTask(int id, int userId);

}