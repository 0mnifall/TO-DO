using backend.Dto.Task;
using backend.Models;

namespace backend.Data.Repositories;

public interface ICategoryRepository
{
    Task AddCategory(Category category);
    Task<IEnumerable<Category>> GetAllUserCategories(int userId);
    Task<IEnumerable<TaskPreviewDto>?> GetAllCategoryTasks(int id, int userId);
    Task<bool> DeleteCategory(int id, int userId);
}