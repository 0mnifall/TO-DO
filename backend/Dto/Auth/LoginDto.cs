using System.ComponentModel.DataAnnotations;

namespace backend.Dto.Auth;

public record LoginDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Password { get; set; }
}