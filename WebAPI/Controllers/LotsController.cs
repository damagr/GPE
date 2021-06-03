using GPE.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace GPE.Controllers
{
    [RoutePrefix("api/Lots")]
    public class LotsController : ApiController
    {
        LotsRepository lotsRepository = new LotsRepository();

        [Route(""), HttpGet] 
        // GET: api/Lots
        public IEnumerable<Lot> Get()
        {
            List<Lot> lot = lotsRepository.Retrieve();
            return lot;
        }

        [Route(""), HttpGet]
        // GET: api/Lots/5
        public IEnumerable<Lot> Get(int ArticleId)
        {
            List<Lot> lot = lotsRepository.Retrieve(ArticleId);
            return lot;
        }

        [Route(""), HttpPost]
        // POST: api/Lots
        public void Post([FromBody]Lot lot)
        {
            lotsRepository.Save(lot);

        }

        [Route(""), HttpPut]
        // PUT: api/Lots/5
        public void Put([FromBody]Lot lot)
        {
            lotsRepository.Update(lot);
        }

    }
}