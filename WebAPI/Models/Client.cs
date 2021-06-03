using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GPE.Models
{
    public class Client
    {
        public Client()
        {
        }

        public Client(int clientId, string name, string address, string city, string postalCode, string province, string country, string phone, string email, string nIF, string contactName, DateTime registerDate, bool enabled)
        {
            ClientId = clientId;
            Name = name;
            Address = address;
            City = city;
            PostalCode = postalCode;
            Province = province;
            Country = country;
            Phone = phone;
            Email = email;
            NIF = nIF;
            ContactName = contactName;
            RegisterDate = registerDate;
            Enabled = enabled;
        }

        public int ClientId { get; set; }
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        [Required]
        [StringLength(100)]
        public string Address { get; set; }
        [Required]
        [StringLength(50)]
        public string City { get; set; }
        [Required]
        [StringLength(5)]
        public string PostalCode { get; set; }
        [Required]
        [StringLength(50)]
        public string Province { get; set; }
        [Required]
        [StringLength(50)]
        public string Country { get; set; }
        [Required]
        [StringLength(9)]
        public string Phone { get; set; }
        [Required]
        [StringLength(50)]
        public string Email { get; set; }
        [Required]
        [StringLength(50)]
        public string NIF { get; set; }
        [StringLength(50)]
        public string ContactName { get; set; }
        [Required]
        public DateTime RegisterDate { get; set; }
        [Required]
        public bool Enabled { get; set; }
        
        public List<Order> Orders { get; set; }
    }
}