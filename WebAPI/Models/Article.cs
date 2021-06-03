using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GPE.Models
{
    public class Article
    {
        public Article()
        {

        }

        public Article(int articleId, string description, double price, string brand, string category, double iva, bool enabled)
        {
            ArticleId = articleId;
            Description = description;
            Price = price;
            Brand = brand;
            Category = category;
            Iva = iva;
            Enabled = enabled;
        }

        public int ArticleId { get; set; }
        [Required]
        [StringLength(100)]
        public string Description { get; set; }
        public double Price { get; set; }
        [Required]
        [StringLength(50)]
        public string Brand { get; set; }
        [Required]
        [StringLength(50)]
        public string Category { get; set; }
        [Required]
        public double Iva { get; set; }
        [Required]
        public bool Enabled { get; set; }

        public List<Lot> Lots { get; set; }
    }
}