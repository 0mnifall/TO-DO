using System.ComponentModel.DataAnnotations;

namespace backend.Dto.Auth;

public record LoginDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    public required string Password { get; init; }
}