using backend.Dto.Category;
using backend.Dto.Task;
using backend.Models;

namespace backend.Services;

public interface ICategoryService
{
    Task CreateCategory(string name, int userId);
    Task<IEnumerable<CategoryPreviewDto>> GetAllUserCategories(int userId);
    Task<CategoryDto?> GetCategoryForView(int id, int userId);
    Task<bool> DeleteCategory(int id, int userId);
}