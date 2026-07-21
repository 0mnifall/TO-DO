using backend.Models;

namespace backend.Dto.Task;

public record TaskPreviewDto
{
    public required string Title { get; init; }
    public bool IsCompleted { get; init; }
    public DateTime? DisplayedDate { get; init; }
    public TaskPriority Priority { get; init; }
    public Category? Category { get; init; }
}