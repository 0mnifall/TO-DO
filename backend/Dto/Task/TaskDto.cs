using backend.Models;

namespace backend.Dto.Task;

public record TaskDto
{
    public required string Title { get; init; }
    public string? Description { get; init; }
    public bool IsCompleted  { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? DisplayedDate { get; init; }
    public TaskPriority Priority { get; init; }
    public Category? Category { get; init; }

}