namespace backend.Dto.Task;

public class PagedResult
{
    public required IEnumerable<TaskPreviewDto> Items { get; set; }

    public int Page { get; set; }
    public int PageSize { get; set; }

    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}