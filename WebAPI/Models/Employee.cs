using System.ComponentModel.DataAnnotations;

namespace GPE.Models
{
    public class Employee
    {
        public Employee()
        {

        }

        public Employee(int employeeId, string name, string type, string deliverer, bool enabled)
        {
            EmployeeId = employeeId;
            Name = name;
            Type = type;
            Deliverer = deliverer;
            Enabled = enabled;
        }

        public int EmployeeId { get; set; }
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        [Required]
        [StringLength(50)]
        public string Type { get; set; }
        [StringLength(50)]
        public string Deliverer { get; set; }
        [Required]
        public bool Enabled { get; set; }
    }
}