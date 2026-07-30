using backend.Dto.Category;
using backend.Dto.Task;
using backend.Models;

namespace backend.Data.Repositories;

public interface ICategoryRepository
{
    Task AddCategory(Category category);
    Task<IEnumerable<CategoryPreviewDto>> GetAllUserCategories(int userId);
    Task<CategoryDto?> GetCategoryForView(int id, int userId);
    Task<bool> DeleteCategory(int id, int userId);
}