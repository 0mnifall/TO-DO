namespace backend.Dto.Category;

public record CategoryPreviewDto
{
    public int Id { get; init;}
    public required string Name { get; init;}
}