namespace backend.Dto.Task;

public class TaskQueryDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 5;

    public string? Search { get; set; }
    public bool? IsCompleted { get; set; }
    public int? CategoryId { get; set; }
}