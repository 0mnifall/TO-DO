using System.Security.Claims;
using backend.Dto.Category;
using backend.Dto.Task;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService service) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpPost]
    public async Task<IActionResult> CreateCategory(string name)
    {
        await service.CreateCategory(name, CurrentUserId);
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryPreviewDto>>> GetAllCategories()
    {
        return Ok(await service.GetAllUserCategories(CurrentUserId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategoryForView(int id)
    {
        var category = await service.GetCategoryForView(id, CurrentUserId);
        if (category == null)
        {
            return Forbid();
        }
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        if (!await service.DeleteCategory(id, CurrentUserId))
        {
            return Forbid();
        }
        return NoContent();
    }
}