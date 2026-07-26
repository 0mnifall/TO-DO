using System.Security.Claims;
using backend.Dto.Auth;
using backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService service) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await service.IsExist(dto.Email))
        {
            return BadRequest("Email already exists");
        }

        await service.Register(dto);
        
        return Ok();
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<string>> Login(LoginDto dto)
    {
        var user = await service.FindUser(dto.Email);

        if (user == null)
        {
            return NotFound();
        }

        if (!service.Verify(dto.Password, user.PasswordHash))
        {
            return Unauthorized();
        }
        
        var authData = await service.Login(user);
        
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        };
        
        Response.Cookies.Append("access_token", authData.AccessToken, cookieOptions);
        Response.Cookies.Append("refresh_token", authData.RefreshToken, cookieOptions);
        
        return Ok(authData.UserName);
    }
    
    [HttpPost("refresh")]
    public async Task<ActionResult> Refresh(RefreshRequest request)
    {
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
        {
            return Unauthorized();
        }

        var user = await service.FindRefresh(refreshToken);
        if (user == null)
        {
            return Unauthorized();
        }

        var newAccessToken = service.GenerateJwtToken(user);
        var newRefreshToken =  service.GenerateRefreshToken();
        
        await service.UpdateRefreshToken(user.Email, newRefreshToken);
        
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("access_token", newAccessToken, cookieOptions);
        Response.Cookies.Append("refresh_token", newRefreshToken, cookieOptions);

        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await service.Logout(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value));
        
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");
        
        return Ok();
    }
    
    [HttpGet("user")]
    public IActionResult GetUser()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return Ok(new { isAuthenticated = true, username = User.Identity.Name });
        }
        return Ok(new { isAuthenticated = false });
    }
}