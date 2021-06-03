using System.Collections.Generic;
using System.Web.Http;
using GPE.Models;

namespace GPE.Controllers
{
    [RoutePrefix("api/OrderLines")]
    public class OrderLinesController : ApiController
    {
        OrderLinesRepository orderLinesRepository = new OrderLinesRepository();

        [Route(""), HttpGet]
        // GET api/OrderLines
        public IEnumerable<OrderLine> Get()
        {
            List<OrderLine> orderLines = orderLinesRepository.Retrieve();
            return orderLines;
        }

        [Route(""), HttpGet]
        // GET api/OrderLinesByOrderId
        public IEnumerable<OrderLine> GetByOrderId(int orderId)
        {
            List<OrderLine> orderLines = orderLinesRepository.RetrieveByOrder(orderId);
            return orderLines;
        }

        [Route(""), HttpPost]
        // POST api/OrderLines
        public void Post([FromBody] List<OrderLine> orderLines)
        {
            orderLinesRepository.Save(orderLines);
        }

        [Route(""), HttpPut]
        // PUT api/OrderLines
        public void Put([FromBody] OrderLine orderLine)
        {
            orderLinesRepository.Put(orderLine);
        }
    }
}