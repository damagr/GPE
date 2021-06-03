using System.Collections.Generic;
using System.Linq;

namespace GPE.Models
{
    public class OrderLinesRepository
    {
        /// <summary>
        /// We declare here the GPEContext object which we'll use to charge our tables objects
        /// </summary>
        GPEContext context = new GPEContext();

        /// <summary>
        /// Used for charge all order lines from all orders.
        /// </summary>
        /// <returns>Returns a List of OrderLines</returns>
        internal List<OrderLine> Retrieve()
        {
            List<OrderLine> orderLines = context.OrderLines
                .ToList();

            return orderLines;
        }

        /// <summary>
        /// Used for charge all order lines depending of the orderID from DB
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns>Returns a List of OrderLines</returns>
        internal List<OrderLine> RetrieveByOrder(int orderId)
        {
            List<OrderLine> orderLines = context.OrderLines
                .Where(o => o.OrderId == orderId)
                .ToList();

            return orderLines;
        }

        /// <summary>
        /// Used for save a OrderLine
        /// </summary>
        /// <param name="orderL">This method needs the OrderLine object for save</param>
        internal void Save(List<OrderLine> orderLines)
        {
            LotsRepository lotsRepository = new LotsRepository();
            OrderLine line1 = new OrderLine();

            foreach (OrderLine line in orderLines)
            {
                line1 = context.OrderLines
                .Where(a => a.OrderId == line.OrderId && a.LineId == line.LineId)
                .FirstOrDefault();
                if (line1 != null)
                {
                    orderLines.Remove(line);
                }
            }

            context.OrderLines.AddRange(orderLines);
            context.SaveChanges();

            foreach (OrderLine orderLine in orderLines)
            {
                lotsRepository.UpdateStock(orderLine.ArticleId, orderLine.LotId, orderLine.Quantity);
            }
        }

        /// <summary>
        /// This method is used for update items from all tables which is related OrderLine, this tables are Orders and Lots. We take an OrderLine object and we charge 2 new objects
        /// one OrderLine (the old one) and the Order with which it is related. 
        /// If we detect that some fields are different between orderL and orderLine we start to change values from different tables as we can see down here.
        /// For more info read the methods what's are down of the Delete method.
        /// </summary>
        /// <param name="orderL">Object that we need to work with the correct orderLine</param>
        internal void Put(OrderLine orderL)
        {
            OrderLine orderLine = context.OrderLines
                .Where(o => o.OrderId == orderL.OrderId && o.LineId == orderL.LineId)
                .FirstOrDefault();

            Order order = context.Orders
                .Where(or => or.OrderId == orderL.OrderId)
                .FirstOrDefault();

            if (orderL.LotId != orderLine.LotId)
            {
                changeLot(orderLine.LotId, orderL.LotId, orderLine.Quantity, orderL.Quantity);
                orderLine.LotId = orderL.LotId;
            }

            if (orderL.Price != orderLine.Price)
            {
                changeTotalLine(orderL.OrderId, orderL.LineId, orderL.Price, orderL.Quantity, orderL.Discount, orderL.Iva);
                orderLine.Price = orderL.Price;
                changeTotalOrder(order.OrderId);
            }

            if (orderL.Quantity != orderLine.Quantity)
            {
                changeStock(orderL.LotId, orderL.Quantity);
                orderLine.Quantity = orderL.Quantity;
                changeTotalLine(orderL.OrderId, orderL.LineId, orderL.Price, orderL.Quantity, orderL.Discount, orderL.Iva);
                changeTotalOrder(order.OrderId);
            }

            if (orderL.Discount != orderLine.Discount)
            {
                changeTotalLine(orderL.OrderId, orderL.LineId, orderL.Price, orderL.Quantity, orderL.Discount, orderL.Iva);
                orderLine.Discount = orderL.Discount;
                changeTotalOrder(order.OrderId);
            }

            context.OrderLines.Update(orderLine);
            context.SaveChanges();
        }

        /// <summary>
        /// Method used in Put method for update the totalLine, here we charge an objecte with the same id and after calculate again the total, if we have a discount
        /// we calculate the IVA after applicate the discount, if we dont have discount we just calculate IVA using the priceQuantity.
        /// </summary>
        /// <param name="orderId"></param>
        /// <param name="lineId"></param>
        /// <param name="price"></param>
        /// <param name="quant"></param>
        /// <param name="discount"></param>
        /// <param name="iva"></param>
        private void changeTotalLine(int orderId, int lineId, double price, int quant, double discount, double iva)
        {
            OrderLine orderLine = context.OrderLines
               .Where(o => o.OrderId == orderId && o.LineId == lineId)
               .FirstOrDefault();

            double priceQuantity = price * quant;
            double priceDiscount = priceQuantity - (priceQuantity * (discount / 100));
            double priceIva = priceDiscount + (priceDiscount * (iva / 100));

            orderLine.TotalLine = priceIva;

            context.OrderLines.Update(orderLine);
            context.SaveChanges();
        }

        /// <summary>
        /// Method used in Put method for update the Total from the Order which we are modifying their lines, we just iterate all lines from the
        /// order that we are working and finally we update the total order with the sum of all TotalLines.
        /// </summary>
        /// <param name="orderId"></param>
        private void changeTotalOrder(int orderId)
        {
            double newTotal = 0;

            Order order = context.Orders
               .Where(or => or.OrderId == orderId)
               .FirstOrDefault();

            List<OrderLine> orderLines = RetrieveByOrder(orderId);

            foreach (OrderLine ol in orderLines)
            {
                newTotal += ol.TotalLine;
            }

            order.Total = newTotal;

            context.Orders.Update(order);
            context.SaveChanges();
        }

        /// <summary>
        /// Method used in Put method, if we need to change the lot from a Line, we have to give back the old lot its stock and take the new quantity
        /// from the new lot.
        /// </summary>
        /// <param name="oldLot"></param>
        /// <param name="newLot"></param>
        /// <param name="oldStock"></param>
        /// <param name="newStock"></param>
        private void changeLot(string oldLot, string newLot, int oldStock, int newStock)
        {
            Lot lotOld = context.Lots
                .Where(lo => lo.LotId == oldLot)
                .FirstOrDefault();

            Lot lotNew = context.Lots
                .Where(ln => ln.LotId == newLot)
                .FirstOrDefault();

            lotOld.Stock += oldStock;
            lotNew.Stock -= newStock;

            context.Lots.UpdateRange(lotOld, lotNew);
            context.SaveChanges();
        }

        /// <summary>
        /// Method used in Put method, if we need to change the quantity from a line, we have to change it from the Lot table too.
        /// </summary>
        /// <param name="lotId"></param>
        /// <param name="stock"></param>
        private void changeStock(string lotId, int stock)
        {
            Lot lot = context.Lots
               .Where(l => l.LotId == lotId)
               .FirstOrDefault();

            lot.Stock = stock;

            context.Lots.Update(lot);
            context.SaveChanges();
        }
    }
}