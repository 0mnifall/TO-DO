using System.ComponentModel.DataAnnotations;

namespace backend.Dto.Auth;

public record RefreshRequest
{
    [Required]
    public string RefreshToken { get; init; } = string.Empty;
}