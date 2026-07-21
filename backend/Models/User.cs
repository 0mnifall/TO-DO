namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    
    public string? RefreshToken { get; set; }
    public DateTime Expires { get; set; }
    
    public ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
}