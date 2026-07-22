using backend.Dto.Task;
using backend.Models;

namespace backend.Services;

public interface ICategoryService
{
    Task CreateCategory(string name, int userId);
    Task<IEnumerable<Category>> GetAllUserCategories(int userId);
    Task<IEnumerable<TaskPreviewDto>?> GetAllCategoryTasks(int id, int userId);
    Task<bool> DeleteCategory(int id, int userId);
}