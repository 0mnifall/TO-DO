using backend.Models;

namespace backend.Dto.Task;

public record CreateTaskDto
{
    public required string Title {get; init;}
    public string? Description {get; init;}
    public DateTime? DueDate {get; init;}
    public int? CategoryId {get; init;}
}