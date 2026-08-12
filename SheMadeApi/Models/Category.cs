namespace SheMadeApi.Models
{
    public class Category
    {
        public int CategoryID { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string ParentCategory { get; set; } = string.Empty; // "Crochet" or "Beads"
        public string? IconName { get; set; }

        public List<Product> Products { get; set; } = new();
    }
}
