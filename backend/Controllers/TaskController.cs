using System.Security.Claims;
using backend.Dto.Task;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskController(ITaskService service) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    
    [HttpPost]
    [Authorize]
    [Route("/create")]
    public async Task<IActionResult> CreateTask(CreateTaskDto task)
    {
        await service.CreateTask(task, CurrentUserId);
        return Ok();
    }

    [HttpGet]
    [Authorize]
    [Route("/tasks")]
    public async Task<ActionResult<IEnumerable<TaskPreviewDto>>> GetAllTasks()
    {
        return Ok(await service.GetAllUserTasks(CurrentUserId));
    }

    [HttpGet]
    [Authorize]
    [Route("/tasks/{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var task = await service.GetTaskById(id, CurrentUserId);
        
        if (task == null)
        {
            return NotFound();
        }
        
        return Ok(task);
    }

    [HttpPut]
    [Authorize]
    [Route("/tasks/{id}")]
    public async Task<IActionResult> UpdateTask(int id)
    {
        if (await service.UpdateTask(id, CurrentUserId))
        {
            return Ok();
        }
        return BadRequest();
    }

    [HttpDelete]
    [Authorize]
    [Route("/tasks/{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        if (await service.DeleteTask(id, CurrentUserId))
        {
            return NoContent();
        }
        return Forbid();
    }

    [HttpPost]
    [Authorize]
    [Route("/tasks/{id}/complete")]
    public async Task<IActionResult> CompleteTask(int id)
    {
        if (await service.CompleteTask(id, CurrentUserId))
        {
            return Ok();
        }
        return Forbid();
    }

    [HttpPost]
    [Authorize]
    [Route("/tasks/{id}/reopen")]
    public async Task<IActionResult> ReopenTask(int id)
    {
        if (await service.ReopenTask(id, CurrentUserId))
        {
            return Ok();
        }
        return Forbid();
    }
}