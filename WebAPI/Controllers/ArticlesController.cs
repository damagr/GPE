using GPE.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace GPE.Controllers
{
    [RoutePrefix("api/Articles")]
    public class ArticlesController : ApiController
    {
        ArticlesRepository articlesRepository = new ArticlesRepository();

        [Route(""), HttpGet]
        // GET: api/Article
        public IEnumerable<Article> Get()
        {
            List<Article> articles = articlesRepository.Retrieve();
            return articles;
        }

        [Route("BackOffice"),HttpGet]
        // GET: api/Article
        public IEnumerable<Article> GetBackoffice()
        {
            List<Article> articles = articlesRepository.RetrieveBackoffice();
            return articles;
        }

        [Route(""), HttpGet]
        // GET: api/Article
        public Article Get(int articleId)
        {
            Article article = articlesRepository.Retrieve(articleId);
            return article;
        }

        [Route(""), HttpPost]
        // POST: api/Article
        public void Post(Article article)
        {
            articlesRepository.Save(article);
        }

        [Route(""), HttpPut]
        // PUT: api/Articles/
        public void Put([FromBody] Article article)
        {
            articlesRepository.Update(article);
        }

        [Route("ChangeState"), HttpPut]
        // PUT: api/Article/ID_Number
        public void Put(int id)
        {
            articlesRepository.ChangeState(id);
        }
    }
}