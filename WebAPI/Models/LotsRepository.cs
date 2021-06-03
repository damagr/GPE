using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace GPE.Models
{
    public class LotsRepository
    {
        GPEContext context = new GPEContext();
        /// <summary>
        /// get a list of lots
        /// </summary>
        /// <returns></returns>
        internal List<Lot> Retrieve()
        {
            List<Lot> lots = new List<Lot>();
            lots = context.Lots.ToList();
            return lots;
        }

        /// <summary>
        /// Here we get a list of Lots depending of the articleId
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        internal List<Lot> Retrieve(int articleId)
        {
            List<Lot> lots = new List<Lot>();
            lots = context.Lots
                .Where(l => l.ArticleId == articleId)
                .ToList();
            return lots;
        }

        /// <summary>
        /// Here we update the stock after recieve a new order.
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="lotId"></param>
        /// <returns></returns>
        public void UpdateStock(int articleId, string lotId, int stock)
        {
            Lot lot = new Lot();
            lot = context.Lots
                .Where(l => l.ArticleId == articleId && l.LotId == lotId)
                .FirstOrDefault();

            lot.Stock -= stock;

            context.Lots.Update(lot);
            context.SaveChanges();
        }

        /// <summary>
        ///  use for add new lot
        /// </summary>
        /// <param name="lot"></param>
        internal void Save(Lot lot)
        {
            Lot lot1 = new Lot();
            lot1 = context.Lots
            .Where(l => l.ArticleId == lot.ArticleId && l.LotId == lot.LotId)
            .FirstOrDefault();
            if (lot1==null )
            {
                context.Lots.Add(lot);
                context.SaveChanges();
            }
        }

        /// <summary>
        /// use for update stock of lot
        /// </summary>
        /// <param name="lot"></param>
        internal void Update(Lot lot)
        {
            context.Lots.Update(lot);
            context.SaveChanges();
        }
    }
}