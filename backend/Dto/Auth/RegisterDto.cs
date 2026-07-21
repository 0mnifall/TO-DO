using System.ComponentModel.DataAnnotations;

namespace backend.Dto.Auth;

public record RegisterDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public required string Username { get; init; }

    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [MinLength(8)]
    public required string Password { get; init; }
}