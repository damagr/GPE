using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GPE.Models
{
    public class ClientsRepository
    {

        /// <summary>
        /// Defining context for interactions with database
        /// </summary>
        GPEContext context = new GPEContext();

        /// <summary>
        /// Gets all clientes
        /// </summary>
        /// <returns>Lis of all clients</returns>
        internal List<Client> GetClients()
        {
            List<Client> clients = new List<Client>();
            clients = context.Clients
                .Where(c => c.Enabled)
                .ToList();

            return clients;
        }

        /// <summary>
        /// Gets all clientes
        /// </summary>
        /// <returns>Lis of all clients</returns>
        internal List<Client> GetBackoffice()
        {
            List<Client> clients = new List<Client>();
            clients = context.Clients
                .ToList();

            return clients;
        }

        /// <summary>
        /// adds new client
        /// </summary>
        /// <param name="c">client to add</param>
        internal void AddClient(Client client)
        {

            Client client1 = new Client();
            client1 = context.Clients
            .Where(c => c.NIF == client.NIF )
            .FirstOrDefault();
            if (client1 == null)
            {
                client.Country = "España";
                client.Enabled = true;
                client.RegisterDate = DateTime.Now;
                context.Clients.Add(client);
                context.SaveChanges();
            }

        }

        /// <summary>
        /// gets all clients with a certain name
        /// </summary>
        /// <param name="n">name to filter</param>
        /// <returns>lis of filtered clients</returns>
        internal List<Client> GetClientsByName(string n)
        {
            List<Client> clients = new List<Client>();

            clients = context.Clients
                    .Where(c => c.Name == (n))
                    .ToList();

            return clients;
        }

        /// <summary>
        /// gets client with a certain id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>return a client</returns>
        internal Client GetClientById(int id)
        {
            Client client = context.Clients
                    .Where(c => c.ClientId == id)
                    .FirstOrDefault();

            return client;
        }

        /// <summary>
        /// gets the register date from all clients
        /// </summary>
        /// <returns>all the diferent dates</returns>
        internal List<string> GetClientsRegister()
        {
            List<string> dates = new List<string>();

            dates = context.Clients
                .DistinctBy(f => f.RegisterDate.ToShortDateString())
                .Select(f => f.RegisterDate.ToShortDateString())
                .ToList();

            return dates;
        }

        /// <summary>
        /// gets the number of dates that repeats
        /// </summary>
        /// <returns>times each register date appears</returns>
        internal List<int> RetrieveCountRegisters()
        {
            List<int> countRegisters = new List<int>();
            List<string> datesDistinct = GetClientsRegister();
            List<string> datesAll = context.Clients
                .Select(f => f.RegisterDate.ToShortDateString())
                .ToList();

            foreach (string fecha in datesDistinct)
            {
                int count = datesAll.Count(f => f == fecha);
                countRegisters.Add(count);
            }

            return countRegisters;
        }

        /// <summary>
        /// Updates a client recibing all parameters
        /// </summary>
        /// <param name="c">data to update client</param>
        internal void UpdateClient(Client c)
        {
            context.Clients.Update(c);
            context.SaveChanges();
        }

        /// <summary>
        /// changes the state of enabled of a client
        /// </summary>
        /// <param name="id">id of the user to update</param>
        internal void UpdateBlockedClient(int id)
        {
            Client client = context.Clients.Find(id);
            client.Enabled = !client.Enabled;
            context.Clients.Update(client);
            context.SaveChanges();
        }
    }

}