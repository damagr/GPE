using System.Collections.Generic;
using System.Linq;

namespace GPE.Models
{
    public class EmployeesRepository
    {
        GPEContext context = new GPEContext();

        //Show all employees
        internal List<Employee> Retrieve()
        {
            List<Employee> employees = context.Employees
                .Where(e=>e.Enabled)
                .ToList();
            return employees;
        }

        //Show all employees
        internal List<Employee> RetrieveBackoffice()
        {
            List<Employee> employees = context.Employees
                .ToList();
            return employees;
        }

        //Add a new employeer
        internal void Save(Employee emp)
        {
            context.Employees.Add(emp);
            context.SaveChanges();
        }
         //Update an existent user
        internal void Update(Employee employee)
        {
            context.Employees.Update(employee);
            context.SaveChanges();
        }

        /// <summary>
        /// changes the state of enabled of a client
        /// </summary>
        /// <param name="id">id of the user to update</param>
        internal void ChangeState(int employeeId)
        {
            Employee employee = context.Employees.Find(employeeId);
            employee.Enabled = !employee.Enabled;
            context.Employees.Update(employee);
            context.SaveChanges();
        }
    }
}