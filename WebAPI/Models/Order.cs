using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GPE.Models
{
    public class Order
    {
        public Order()
        {

        }
        public Order(int orderId, int clientId, string orderNum, DateTime date, DateTime deliveryDate, double total, bool delivered, double paid, string payingMethod, string deliverer, int employeeId)
        {
            OrderId = orderId;
            ClientId = clientId;
            OrderNum = orderNum;
            Date = date;
            DeliveryDate = deliveryDate;
            Total = total;
            Delivered = delivered;
            Paid = paid;
            PayingMethod = payingMethod;
            Deliverer = deliverer;
            EmployeeId = employeeId;
        }

        public int OrderId { get; set; }
        public int ClientId { get; set; }
        public string OrderNum { get; set; }
        public DateTime Date { get; set; }
        [Required]
        public DateTime DeliveryDate { get; set; }
        [Required]
        public double Total { get; set; }
        [Required]
        public bool Delivered { get; set; }
        [Required]
        public double Paid { get; set; }
        [StringLength(50)]
        public string PayingMethod { get; set; }
        [StringLength(50)]
        [Required]
        public string Deliverer { get; set; }
        [Required]
        public int EmployeeId { get; set; }

        public Client Client { get; set; }
        public Employee Employee { get; set; }
        public List<OrderLine> OrderLines { get; set; }
    }
}