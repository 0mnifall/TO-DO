using backend.Dto.Task;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    public async Task AddCategory(Category category)
    {
        category.User = (await context.Users.FirstOrDefaultAsync(x => x.Id == category.UserId))!;
        context.Categories.Add(category);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Category>> GetAllUserCategories(int userId)
    {
        return await context.Categories
            .Where(c => c.UserId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskPreviewDto>?> GetAllCategoryTasks(int id, int userId)
    {
        var category = await context.Categories.FindAsync(id);
        
        if (category?.UserId != userId)
        {
            return null;
        }

        return await context.Tasks
            .Where(t => t.CategoryId == category.Id)
            .Select(t => new TaskPreviewDto
            {
                Id = t.Id,
                Title = t.Title,
                IsCompleted = t.IsCompleted,
                Priority = t.Priority,
                Category = t.Category == null ? null : t.Category.Name,
                DisplayedDate = t.IsCompleted ? t.CompletedAt : t.DueDate
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteCategory(int id, int userId)
    {
        var category = await context.Categories.FindAsync(id);
        if (category?.UserId != userId)
        {
            return false;
        }
        context.Categories.Remove(category);
        await context.SaveChangesAsync();
        return true;
    }
}
