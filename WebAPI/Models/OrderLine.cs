using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GPE.Models
{
    public class OrderLine
    {
        public OrderLine()
        {

        }

        public OrderLine(int orderId, int lineId, int articleId, string lotId, string description, double price, string brand, string category, int quantity, double iva, double discount, double totalLine)
        {
            OrderId = orderId;
            LineId = lineId;
            ArticleId = articleId;
            LotId = lotId;
            Description = description;
            Price = price;
            Brand = brand;
            Category = category;
            Quantity = quantity;
            Iva = iva;
            Discount = discount;
            TotalLine = totalLine;
        }

        [Key, Column(Order = 0)]
        public int OrderId { get; set; }
        [Key, Column(Order = 1)]
        public int LineId { get; set; }
        public int ArticleId { get; set; }
        [Required]
        [StringLength(50)]
        public string LotId { get; set; }
        [Required]
        [StringLength(150)]
        public string Description { get; set; }
        [Required]
        public double Price { get; set; }
        [Required]
        [StringLength(50)]
        public string Brand { get; set; }
        [Required]
        [StringLength(50)]
        public string Category { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public double Iva { get; set; }
        public double Discount { get; set; }
        public double TotalLine { get; set; }

        public Order Order { get; set; }
        public Article Article { get; set; }
    }
}