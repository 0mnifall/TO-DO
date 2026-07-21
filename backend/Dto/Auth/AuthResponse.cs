using System.ComponentModel.DataAnnotations;

namespace backend.Dto.Auth;

public record AuthResponse
{
    [Required]
    public required string AccessToken { get; set; }
    [Required]
    public required string RefreshToken { get; set; } 
}