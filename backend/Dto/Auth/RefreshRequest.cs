using System.ComponentModel.DataAnnotations;

namespace backend.Dto.Auth;

public class RefreshRequest
{
    [Required]
    public string RefreshToken { get; init; } = string.Empty;
}