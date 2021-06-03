using System.Collections.Generic;
using System.Web.Http;
using GPE.Models;

namespace GPE.Controllers
{
    [RoutePrefix("api/Employees")]
    public class EmployeesController : ApiController
    {
        EmployeesRepository employeesRepository = new EmployeesRepository();

        [Route(""), HttpGet]
        // GET: api/Employee
        public IEnumerable<Employee> Get()
        {
            List<Employee> emp = employeesRepository.Retrieve();
            return emp;
        }

        [Route("BackOffice"), HttpGet]
        // GET: api/Employee
        public IEnumerable<Employee> GetBackoffice()
        {
            List<Employee> emp = employeesRepository.RetrieveBackoffice();
            return emp;
        }

        [Route(""), HttpPost]
        // POST: api/Employee
        public void Post([FromBody] Employee emp)
        {
            employeesRepository.Save(emp);
        }

        [Route(""), HttpPut]
        // PUT: api/Employee
        public void Put([FromBody] Employee employee)
        {
            employeesRepository.Update(employee);
        }

        [Route("ChangeState"), HttpPut]
        // PUT api/Employees
        public void Put(int employeeId)
        {
            employeesRepository.ChangeState(employeeId);
        }
    }
}
