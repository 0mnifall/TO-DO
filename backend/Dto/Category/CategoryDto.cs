using backend.Dto.Task;

namespace backend.Dto.Category;

public record CategoryDto
{
    public required string Name { get; init;}
    public IEnumerable<TaskPreviewDto> Tasks { get; init;} = [];
}