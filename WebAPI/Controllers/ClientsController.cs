using GPE.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace GPE.Controllers
{
    [RoutePrefix("api/Clients")]
    public class ClientsController : ApiController
    {
        ClientsRepository clientsRepository = new ClientsRepository();

        [Route(""), HttpGet]
        // GET api/Clients
        public IEnumerable<Client> Get()
        {
            List<Client> clients = clientsRepository.GetClients();
            return clients;
        }

        // GET api/Clients
        [Route("BackOffice"),HttpGet]
        public IEnumerable<Client> GetBackoffice()
        {
            List<Client> clients = clientsRepository.GetBackoffice();
            return clients;
        }

        [Route(""), HttpGet]
        // GET api/Clients?name=value
        public IEnumerable<Client> Get(string name)
        {
            List<Client> clients = clientsRepository.GetClientsByName(name);
            return clients;
        }

        [Route(""), HttpGet]
        // GET api/Clients?clientId=value
        public Client Get(int clientId)
        {
            Client client = clientsRepository.GetClientById(clientId);
            return client;
        }

        //GET: api/ClientsRegsiter
        [Route("GetDates"), HttpGet]
        public IEnumerable<string> GetRegisters()
        {
            List<string> clients = clientsRepository.GetClientsRegister();
            return clients;
        }

        // GET: api/ClientsCountRegisters
        [Route("GetRegisters"), HttpGet]
        public IEnumerable<int> GetCountRegsiters()
        {
            List<int> clients = clientsRepository.RetrieveCountRegisters();
            return clients;
        }

        [Route("AddClient"), HttpPost]
        // POST api/Clients
        public void Post([FromBody] Client client)
        {
            clientsRepository.AddClient(client);
        }

        [Route(""), HttpPut]
        // PUT api/Clients
        public void Put([FromBody] Client client)
        {
            clientsRepository.UpdateClient(client);
        }

        [Route(""), HttpPut]
        // PUT api/Clients/2
        public void Put(int id)
        {
            clientsRepository.UpdateBlockedClient(id);
        }
    }
}