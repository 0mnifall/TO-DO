using backend.Dto.Category;
using backend.Dto.Task;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    public async Task AddCategory(Category category)
    {
        context.Categories.Add(category);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<CategoryPreviewDto>> GetAllUserCategories(int userId)
    {
        return await context.Categories
            .Where(c => c.UserId == userId)
            .Select(c => new CategoryPreviewDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();
    }

    public async Task<CategoryDto?> GetCategoryForView(int id, int userId)
    {
        return await context.Categories
        .Include(c => c.Tasks)
        .Where(c => c.Id == id && c.UserId == userId)
        .Select(c => new CategoryDto
        {
            Name = c.Name,
            Tasks = c.Tasks
            .Select(t => new TaskPreviewDto
            {
                Id = t.Id,
                Title = t.Title,
                IsCompleted = t.IsCompleted,
                Priority = t.Priority,
                Category = t.Category == null ? null : t.Category.Name,
                DisplayedDate = t.IsCompleted ? t.CompletedAt : t.CreatedAt
            })
        })
        .FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteCategory(int id, int userId)
    {
        var category = await context.Categories
            .Include(c => c.Tasks)
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category == null)
        {
            return false;
        }

        foreach (var task in category.Tasks)
        {
            task.CategoryId = null;
        }

        context.Categories.Remove(category);
        await context.SaveChangesAsync();
        return true;
    }
}
