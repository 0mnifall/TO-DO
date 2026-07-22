using backend.Models;

namespace backend.Dto.Task;

public record TaskPreviewDto
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public bool IsCompleted { get; init; }
    public DateTime? DisplayedDate { get; init; }
    public TaskPriority Priority { get; init; }
    public string? Category { get; init; }
}
