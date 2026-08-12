namespace SheMadeApi.DTOs
{
    // Field names here are written so that ASP.NET Core's default camelCase JSON
    // serializer turns them into exactly what app.js already reads:
    // productID, productName, categoryName, parentCategory, price, description,
    // isBestSeller, isNewArrival, mainImage, images
    public class ProductDto
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string ParentCategory { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public bool IsBestSeller { get; set; }
        public bool IsNewArrival { get; set; }
        public string MainImage { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new();
    }
}
