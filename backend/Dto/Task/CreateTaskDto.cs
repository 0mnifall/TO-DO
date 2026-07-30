using backend.Models;

namespace backend.Dto.Task;

public record CreateTaskDto
{
    public required string Title {get; init;}
    public string? Description {get; init;}
    public TaskPriority Priority {get; init;}
    public int? CategoryId {get; init;}
}