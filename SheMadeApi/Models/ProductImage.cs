namespace SheMadeApi.Models
{
    public class ProductImage
    {
        public int ImageID { get; set; }

        public int ProductID { get; set; }
        public Product Product { get; set; } = null!;

        public string ImageURL { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }
}
