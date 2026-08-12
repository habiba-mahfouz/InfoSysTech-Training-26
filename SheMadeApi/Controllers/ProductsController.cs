using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheMadeApi.Data;
using SheMadeApi.DTOs;
using SheMadeApi.Models;

namespace SheMadeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // -> /api/products
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/products?parentCategory=&categoryName=&isBestSeller=&isNewArrival=&search=
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
            [FromQuery] string? parentCategory,
            [FromQuery] string? categoryName,
            [FromQuery] bool? isBestSeller,
            [FromQuery] bool? isNewArrival,
            [FromQuery] string? search)
        {
            var query = _db.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(parentCategory))
                query = query.Where(p => p.Category.ParentCategory.ToLower() == parentCategory.ToLower());

            if (!string.IsNullOrWhiteSpace(categoryName))
                query = query.Where(p => p.Category.CategoryName.ToLower() == categoryName.ToLower());

            if (isBestSeller == true)
                query = query.Where(p => p.IsBestSeller);

            if (isNewArrival == true)
                query = query.Where(p => p.IsNewArrival);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(p =>
                    p.ProductName.ToLower().Contains(q) ||
                    (p.Description != null && p.Description.ToLower().Contains(q)) ||
                    p.Category.CategoryName.ToLower().Contains(q) ||
                    (p.SearchKeywords != null && p.SearchKeywords.ToLower().Contains(q)));
            }

            var products = await query.ToListAsync();
            return Ok(products.Select(ToDto));
        }

        // GET /api/products/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (product == null) return NotFound();
            return Ok(ToDto(product));
        }

        // GET /api/products/5/related
        [HttpGet("{id:int}/related")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetRelated(int id)
        {
            var current = await _db.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (current == null) return NotFound();

            var related = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.ProductID != id && p.Category.ParentCategory == current.Category.ParentCategory)
                .Take(4)
                .ToListAsync();

            return Ok(related.Select(ToDto));
        }

        private static ProductDto ToDto(Product p) => new()
        {
            ProductID = p.ProductID,
            ProductName = p.ProductName,
            CategoryName = p.Category.CategoryName,
            ParentCategory = p.Category.ParentCategory,
            Price = p.Price,
            Description = p.Description,
            IsBestSeller = p.IsBestSeller,
            IsNewArrival = p.IsNewArrival,
            MainImage = p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ImageURL).FirstOrDefault() ?? "",
            Images = p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ImageURL).ToList()
        };
    }
}
