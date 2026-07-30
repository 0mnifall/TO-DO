using backend.Data.Repositories;
using backend.Dto.Category;
using backend.Dto.Task;
using backend.Models;

namespace backend.Services;

public class CategoryService(ICategoryRepository repository) : ICategoryService
{
    public async Task CreateCategory(string name, int userId)
    {
        await repository.AddCategory(new Category { Name = name, UserId = userId });
    }

    public async Task<IEnumerable<CategoryPreviewDto>> GetAllUserCategories(int userId)
    {
        return await repository.GetAllUserCategories(userId);
    }

    public async Task<CategoryDto?> GetCategoryForView(int id, int userId)
    {
        return await repository.GetCategoryForView(id, userId);
    }

    public async Task<bool> DeleteCategory(int id, int userId)
    {
        return await repository.DeleteCategory(id, userId);
    }
}