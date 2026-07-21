using backend.Models;

namespace backend.Dto.Task;

public record TaskPutDto
{
    public required string Title { get; init; }
    public string? Description { get; init; }
    public DateTime? DueDate { get; init; }
    public TaskPriority Priority { get; init; }
    public int? CategoryId { get; init; }
    
}