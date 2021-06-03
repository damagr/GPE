using Microsoft.EntityFrameworkCore;
using System;

namespace GPE.Models
{
    public class GPEContext : DbContext
    {
        public DbSet<Article> Articles { get; set; }
        public DbSet<Lot> Lots { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderLine> OrderLines { get; set; }
        public GPEContext()
        {

        }

        public GPEContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql("Server=127.0.0.1;" +
                                        "Port=3306;" +
                                        "Database=GPE;" +
                                        "Uid=root;" +
                                        "Pwd='';" +
                                        "Convert Zero Datetime=True;" +
                                        "SslMode=none");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // We declare the double key for the OrderLines table, who needs the PK from Orders table and it's own PK
            modelBuilder.Entity<OrderLine>().HasKey(c => new { c.OrderId, c.LineId });

            // We declare the double key for the Lot table, who needs the PK from Article table and it's own PK
            modelBuilder.Entity<Lot>().HasKey(l => new { l.ArticleId, l.LotId });

            // Table Articles
            modelBuilder.Entity<Article>().HasData(new Article(1, "Aquabona 33cl pack 6", 6.5, "Aquabona", "Water", 4, true));
            modelBuilder.Entity<Article>().HasData(new Article(2, "Aquabona 50cl pack 6", 8.5, "Aquabona", "Water", 4, true));
            modelBuilder.Entity<Article>().HasData(new Article(3, "Aquabona 1L pack 6", 10.5, "Aquabona", "Water", 4, true));
            modelBuilder.Entity<Article>().HasData(new Article(4, "CocaCola 25cl pack 6", 8.5, "CocaCola", "Soft drinks", 21, true));
            modelBuilder.Entity<Article>().HasData(new Article(5, "CocaCola 33cl pack 6", 10.5, "CocaCola", "Soft drinks", 21, true));
            modelBuilder.Entity<Article>().HasData(new Article(6, "CocaCola 50cl pack 6", 12.5, "CocaCola", "Soft drinks", 21, true));
            modelBuilder.Entity<Article>().HasData(new Article(7, "CocaCola 75cl pack 6", 14.5, "CocaCola", "Soft drinks", 21, true));
            modelBuilder.Entity<Article>().HasData(new Article(8, "CocaCola 1L pack 6", 16.5, "CocaCola", "Soft drinks", 21, true));
            modelBuilder.Entity<Article>().HasData(new Article(9, "CocaCola 2l pack 6", 18.5, "CocaCola", "Soft drinks", 21, true));
            modelBuilder.Entity<Article>().HasData(new Article(10, "Coffee Nespresso 100 cap", 20.2, "Nespresso", "Coffee", 10, true));
            modelBuilder.Entity<Article>().HasData(new Article(11, "Coffee Nespresso 200 cap", 38.4, "Nespresso", "Coffee", 10, true));
            modelBuilder.Entity<Article>().HasData(new Article(12, "Coffee Nespresso 1Kg", 15.5, "Nespresso", "Coffee", 10, true));
            modelBuilder.Entity<Article>().HasData(new Article(13, "Coffee Nespresso 2Kg", 15.5, "Nespresso", "Coffee", 10, true));
            modelBuilder.Entity<Article>().HasData(new Article(14, "Turia 25cl pack 6", 8.5, "Turia", "Beers", 21, true));
            modelBuilder.Entity<Article>().HasData(new Article(15, "Turia 33cl pack 6", 10.5, "Turia", "Beers", 21, true));
            modelBuilder.Entity<Article>().HasData(new Article(16, "Salted chips 150g", 4.5, "Lays", "Chips", 10, true));
            modelBuilder.Entity<Article>().HasData(new Article(17, "Salted chips 300g", 5.5, "Lays", "Chips", 10, true));
            modelBuilder.Entity<Article>().HasData(new Article(18, "Semi Skimmed Milk", 6.5, "Pascual", "Milk", 4, true));
            modelBuilder.Entity<Article>().HasData(new Article(19, "Whole Skimmed Milk", 6.5, "Pascual", "Milk", 4, true));
            modelBuilder.Entity<Article>().HasData(new Article(20, "Skimmed Milk", 6.5, "Pascual", "Milk", 4, true));

            // Table Lots
            modelBuilder.Entity<Lot>().HasData(new Lot(1, "Lot-01", 500));
            modelBuilder.Entity<Lot>().HasData(new Lot(1, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(2, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(2, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(3, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(3, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(4, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(4, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(5, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(5, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(6, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(6, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(7, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(7, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(8, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(8, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(9, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(9, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(10, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(10, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(11, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(11, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(12, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(12, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(13, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(13, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(14, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(14, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(15, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(15, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(16, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(16, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(17, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(17, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(18, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(18, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(19, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(19, "Lot-02", 200));
            modelBuilder.Entity<Lot>().HasData(new Lot(20, "Lot-01", 1000));
            modelBuilder.Entity<Lot>().HasData(new Lot(20, "Lot-02", 200));

            // Tabla Employees
            modelBuilder.Entity<Employee>().HasData(new Employee(1, "Jesus", "Deliverer", null, true));
            modelBuilder.Entity<Employee>().HasData(new Employee(2, "Miguel", "Salesman", "Jesus", true));
            modelBuilder.Entity<Employee>().HasData(new Employee(3, "Damià", "Deliverer", null, true));
            modelBuilder.Entity<Employee>().HasData(new Employee(4, "Vicent", "Salesman", "Damià", true));
            modelBuilder.Entity<Employee>().HasData(new Employee(5, "Wei", "Salesman", null, false));

            // Tabla Clients
            modelBuilder.Entity<Client>().HasData(new Client(1, "Wei Luo", "C/ Gibraltar", "Silla", "46460", "Valencia", "Spain", "654084820", "emailflamote@gmail.com", "23192424Y", "Paula", Convert.ToDateTime("2021-01-30 00:00:00"), true));
            modelBuilder.Entity<Client>().HasData(new Client(2, "Damià Martínez", "C/ Rei en Jaume", "Cullera", "46400", "Valencia", "Spain", "790151602", "emaildamia@gmail.com", "15461073J", "Paco", Convert.ToDateTime("2021-02-01 00:00:00"), true));
            modelBuilder.Entity<Client>().HasData(new Client(3, "Jesús Salvador", "Avda. Alacant ", "Silla", "46460", "Valencia", "Spain", "772255125", "emailflamote@gmail.com", "57612927C", "Manolo", Convert.ToDateTime("2021-02-01 00:00:00"), true));
            modelBuilder.Entity<Client>().HasData(new Client(4, "Miguel Navarro", "Avda. País Valencià", "Silla", "46460", "Valencia", "Spain", "786183787", "emaildamia@gmail.com", "65660052C", "Agustín", Convert.ToDateTime("2021-02-02 00:00:00"), true));
            modelBuilder.Entity<Client>().HasData(new Client(5, "Vicent Sargues", "C/ Señera", "Albal", "46470", "Valencia", "Spain", "677987409", "emaildamia@gmail.com", "49345715C", "Antonia", Convert.ToDateTime("2021-02-02 00:00:00"), true));

            // Tabla Orders
            modelBuilder.Entity<Order>().HasData(new Order(1, 1, "2021/00001", Convert.ToDateTime("2021-02-01 00:00:00"), Convert.ToDateTime("1900-01-01 00:00:00"), 1938.98, false, 0, null, "Jesus", 2));
            modelBuilder.Entity<Order>().HasData(new Order(2, 2, "2021/00002", Convert.ToDateTime("2021-02-02 00:00:00"), Convert.ToDateTime("1900-01-01 00:00:00"), 2000.98, false, 0, null, "Damià", 4));

            // Tabla OrderLines
            modelBuilder.Entity<OrderLine>().HasData(new OrderLine(1, 1, 1, "Lot-01", "Aquabona 33cl pack 6", 6.5, "Aquabona", "Water", 15, 4, 0, 190.58));
            modelBuilder.Entity<OrderLine>().HasData(new OrderLine(1, 2, 1, "Lot-01", "Turia 25cl pack 6", 8.5, "Turia", "Beers", 25, 21, 10, 285.86));
            modelBuilder.Entity<OrderLine>().HasData(new OrderLine(2, 1, 2, "Lot-02", "Skimmed Milk", 6.5, "MarcaBuena", "RialOne", 15, 4, 0, 281.33));
            modelBuilder.Entity<OrderLine>().HasData(new OrderLine(2, 2, 2, "Lot-02", "Whole Skimmed Milk", 6.5, "MarcaBuena", "RialOne", 25, 4, 10, 450.12));
        }
    }
}