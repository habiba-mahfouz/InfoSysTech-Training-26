namespace SheMadeApi.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;

        public int CategoryID { get; set; }
        public Category Category { get; set; } = null!;

        public decimal Price { get; set; }
        public string? Description { get; set; }
        public string? SearchKeywords { get; set; }
        public bool IsBestSeller { get; set; }
        public bool IsNewArrival { get; set; }

        public List<ProductImage> Images { get; set; } = new();
    }
}
