using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;
using System;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesMasterController : Controller
    {
        private readonly IEmployees _emp;

        public EmployeesMasterController(IEmployees emp)
        {
            _emp = emp;
        }

        [HttpGet("newEmployee")]
        public IActionResult newEmployee()
        {
            return Ok();
        }

        [HttpPost("SaveEmployee")]
        [HttpPost("CreateEmployee")]
        public IActionResult SaveEmployee([FromBody] Employees emp)
        {
            var res = _emp.SaveEmployee(emp);
            return new JsonResult(res);
        }

        [HttpPost("SaveEmpPersonalInfo")]
        public IActionResult SaveEmpPersonalInfo([FromBody] EmployeePersonal emp)
        {
            var res = _emp.SavePersonalInfo(emp);
            return new JsonResult(res);
        }

        [HttpGet("GetEmpPersonalInfo")]
        public IActionResult GetEmpPersonalInfo(string empCode)
        {
            return new JsonResult(_emp.GetPersonalInfo(empCode));
        }

        [HttpPost("saveEmpAddress")]
        public IActionResult saveEmpAddress([FromBody] EmpAddress empAddress)
        {
            return new JsonResult(_emp.SaveEmpAddress(empAddress));
        }

        [HttpGet("GetEmpAddress")]
        public IActionResult GetEmpAddress(string EmpCode)
        {
            var res = _emp.GetEmployeeAddress(EmpCode);
            return new JsonResult(res);
        }

        [HttpGet("GetEmployeeList")]
        public IActionResult GetEmployeeList()
        {
            var username = HttpContext.Session.GetString("Username") ?? "AdminUser";
            return new JsonResult(_emp.GetEmployeeList("ALL", 1, username));
        }

        [HttpGet("EmployeeList")]
        public IActionResult EmployeeList(string companyname, int choice)
        {
            return new JsonResult(_emp.GetEmployeeList(companyname, choice, HttpContext.Session.GetString("Username") ?? "AdminUser"));
        }

        [HttpGet("GetEmployeeListBetweenDate")]
        public IActionResult GetEmployeeListBetweenDate(string companyName, DateTime FromDate, DateTime UptoDate, int Choice)
        {
            return new JsonResult(_emp.GetEmployeeListBetweenDate(companyName, FromDate, UptoDate, Choice = 1));
        }

        [HttpGet("DutyTransfer")]
        [HttpGet("/Employee/EmployeesMaster/DutyTransfer")]
        public IActionResult DutyTransfer()
        {
            return Ok();
        }

        [HttpGet("SearchEmployee")]
        public IActionResult SearchEmployee(string EmpCode)
        {
            return new JsonResult(_emp.SearchEmployee(EmpCode));
        }

        [HttpGet("SearchEmployeeByCategory")]
        [HttpGet("/Employee/EmployeesMaster/SearchEmployeeByCategory")]
        public IActionResult SearchEmployeeByCategory(string company, string category, string dept)
        {
            return new JsonResult(_emp.GetEmployeeListByCategory(company, category, dept));
        }
    }
}
