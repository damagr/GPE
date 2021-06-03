using Microsoft.Ajax.Utilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GPE.Models
{
    public class OrdersRepository
    {
        GPEContext context = new GPEContext();
        /// <summary>
        /// get a list of orders
        /// </summary>
        /// <returns></returns>
        internal List<Order> Retrieve()
        {
            List<Order> order = new List<Order>();
            order = context.Orders
                .Include(ol => ol.OrderLines)
                .Include(cl => cl.Client)
                .ToList();
            return order;
        }

        /// <summary>
        /// get a order by id
        /// </summary>
        /// <returns></returns>
        internal Order Retrieve(int id)
        {
            Order order;
            order = context.Orders.Where(o => o.OrderId == id).FirstOrDefault();
            return order;
        }

        /// <summary>
        /// Get only orders to deliver for the employees
        /// </summary>
        /// <returns></returns>
        internal List<Order> RetrieveDelivers()
        {
            List<Order> order = context.Orders
                .Include(ol => ol.OrderLines)
                .Include(cl => cl.Client)
                .Where(o => o.Delivered == false)
                .ToList();

            return order;
        }
    
        /// <summary>
        /// Get all dates of our orders
        /// </summary>
        /// <returns></returns>
        internal List<string> RetrieveOrdersDate()
        {
            List<string> date = new List<string>();

            date = context.Orders
                .DistinctBy(o => o.Date.ToShortDateString())
                .Select(f => f.Date.ToShortDateString())
                .ToList();

            return date;
        }

        /// <summary>
        /// Get the count of our orders per day
        /// </summary>
        /// <returns></returns>
        internal List<int> RetrieveOrdersCount()
        {
            List<int> countOrders = new List<int>();
            List<string> distinctDates = RetrieveOrdersDate();
            List<string> allDates = context.Orders
                .Select(f => f.Date.ToShortDateString())
                .ToList();

            foreach (string date in distinctDates)
            {
                int count = allDates.Count(f => f == date);
                countOrders.Add(count);
            }

            return countOrders;
        }

        /// <summary>
        /// add a order
        /// </summary>
        /// <param name="order"></param>
        internal void Save(Order order)
        {
            order.Date = DateTime.Now;
            order.OrderNum = NextOrderNum();

            context.Orders.Add(order);
            context.SaveChanges();
        }

        /// <summary>
        /// update a list
        /// </summary>
        /// <param name="order"></param>
        internal void Update(Order order)
        {
            context.Orders.Update(order);
            context.SaveChanges();
        }

        /// <summary>
        /// Update from device when our deliver had delivered the order
        /// </summary>
        /// <param name="order"></param>
        internal void UpdateDeliver(int orderId, double paid, string payingMethod)
        {
            Order order = Retrieve(orderId);

            order.Delivered = true;
            order.Paid = paid;
            order.PayingMethod = payingMethod;
            order.DeliveryDate = DateTime.Now;

            context.Orders.Update(order);
            context.SaveChanges();
        }
        /// <summary>
        /// Updates delivered state in back ofice
        /// </summary>
        /// <param name="id">Id of order to update deliver</param>
        internal void UpdateDelivered(int id)
        {
            Order order = Retrieve(id);
            order.Delivered = !order.Delivered;
            context.Orders.Update(order);
            context.SaveChanges();
        }

        /// <summary>
        /// Gets the last order added to the database
        /// </summary>
        /// <returns></returns>
        internal int GetLastOrderId()
        {
            Order order = Retrieve()
                .LastOrDefault();

            return order.OrderId;
        }

        /// <summary>
        /// Method used to asing the new OrderNum to the newOrders
        /// </summary>
        /// <returns></returns>
        private string NextOrderNum()
        {
            Order order = Retrieve()
                .LastOrDefault();

            string year = DateTime.Now.Year.ToString();
            int newId = order.OrderId;
            newId++;
            string nextNum = year + "/" + newId.ToString("D5");

            return nextNum;
        }
    }
}