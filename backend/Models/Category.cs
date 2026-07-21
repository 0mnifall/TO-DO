namespace backend.Models;

public class Category
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
}