using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContractorMasterController : Controller
    {
        private readonly IContractor _contractor;

        public ContractorMasterController(IContractor contractor)
        {
            _contractor = contractor;
        }

        [HttpGet("Registration")]
        public IActionResult Registration()
        {
            return Ok();
        }

        [HttpGet("GetContractorList")]
        [HttpGet("/Contractor/ContractorMaster/GetContractorList")]
        public IActionResult GetContractorList()
        {
            var username = HttpContext.Session.GetString("Username") ?? "AdminUser";
            var list = _contractor.GetContractorList(username);
            return new JsonResult(list);
        }

        [HttpGet("GetContractorStrength")]
        public IActionResult GetContractorStrength()
        {
            return new JsonResult(_contractor.GetContractorStrength(HttpContext.Session.GetString("Username") ?? "AdminUser"));
        }

        [HttpGet("GetContractorTodayManpower")]
        public IActionResult GetContractorTodayManpower()
        {
            return new JsonResult(_contractor.TodayContractorManpower(HttpContext.Session.GetString("Username") ?? "AdminUser"));
        }

        [HttpGet("GetContractorDateManpower")]
        public IActionResult GetContractorDateManpower(DateTime dt)
        {
            return new JsonResult(_contractor.TodayContractorManpower(HttpContext.Session.GetString("Username") ?? "AdminUser", dt));
        }

        [HttpGet("GetALLContractorTodayManpower")]
        public IActionResult GetALLContractorTodayManpower(DateTime? dt = null)
        {
            return dt.HasValue
                ? new JsonResult(_contractor.TodayALLContractorManpower(dt.Value))
                : new JsonResult(_contractor.TodayALLContractorManpower());
        }

        [HttpGet("GetALLContractorTodayManpowerForDept")]
        public IActionResult GetALLContractorTodayManpowerForDept(DateTime? dt = null)
        {
            return dt.HasValue
                ? new JsonResult(_contractor.TodayALLContractorManpowerForDept(HttpContext.Session.GetString("Username") ?? "AdminUser", dt.Value))
                : new JsonResult(_contractor.TodayALLContractorManpowerForDept(HttpContext.Session.GetString("Username") ?? "AdminUser"));
        }

        [HttpGet("GetALLContractorDateManpowerForDept")]
        public IActionResult GetALLContractorDateManpowerForDept(DateTime dt)
        {
            return new JsonResult(_contractor.TodayALLContractorManpowerForDept(HttpContext.Session.GetString("Username") ?? "AdminUser", dt));
        }

        [HttpGet("GetALLContractorDateManpower")]
        public IActionResult GetALLContractorDateManpower(DateTime dt)
        {
            return new JsonResult(_contractor.TodayALLContractorManpower(dt));
        }

        [HttpGet("ContractorDeptManpoer")]
        public IActionResult ContractorDeptManpoer(DateTime? dt = null)
        {
            return dt.HasValue
                ? new JsonResult(_contractor.DeptContractorManpower(HttpContext.Session.GetString("Username") ?? "AdminUser", dt.Value))
                : new JsonResult(_contractor.DeptContractorManpower(HttpContext.Session.GetString("Username") ?? "AdminUser"));
        }

        [HttpGet("ContractorDateDeptManpower")]
        public IActionResult ContractorDateDeptManpower(DateTime dt)
        {
            return new JsonResult(_contractor.DeptContractorManpower(HttpContext.Session.GetString("Username") ?? "AdminUser", dt));
        }

        [HttpPost("RegisterContractor")]
        public IActionResult RegisterContractor([FromBody] Contractors contractors)
        {
            return new JsonResult(_contractor.RegisterContractor(contractors));
        }
    }
}
