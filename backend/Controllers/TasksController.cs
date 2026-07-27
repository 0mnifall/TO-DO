using System.Security.Claims;
using backend.Dto.Task;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TasksController(ITaskService service) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    
    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskDto task)
    {
        await service.CreateTask(task, CurrentUserId);
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult>> GetAllTasks([FromQuery] TaskQueryDto query)
    {
        return Ok(await service.GetAllUserTasks(query, CurrentUserId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var task = await service.GetTaskById(id, CurrentUserId);
        
        if (task == null)
        {
            return NotFound();
        }
        
        return Ok(task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskPutDto dto)
    {
        if (await service.UpdateTask(id, dto, CurrentUserId))
        {
            return Ok();
        }
        return BadRequest();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        if (await service.DeleteTask(id, CurrentUserId))
        {
            return NoContent();
        }
        return Forbid();
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteTask(int id)
    {
        if (await service.CompleteTask(id, CurrentUserId))
        {
            return Ok();
        }
        return Forbid();
    }

    [HttpPost("{id}/reopen")]
    public async Task<IActionResult> ReopenTask(int id)
    {
        if (await service.ReopenTask(id, CurrentUserId))
        {
            return Ok();
        }
        return Forbid();
    }
}