using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Services;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrgsetupController : Controller
    {
        private readonly IOrgStructure _org;

        public OrgsetupController(IOrgStructure org)
        {
            _org = org;
        }

        [HttpGet("OrgSetupLayout")]
        public IActionResult OrgSetupLayout()
        {
            return Ok();
        }

        [HttpGet("GetDepartmentList")]
        [HttpGet("/OrganizationSetting/OrgSetup/GetDepartmentList")]
        public IActionResult GetDepartmentList()
        {
            return new JsonResult(_org.GetDepartmentList());
        }

        [HttpGet("GetMainDepartmentList")]
        public IActionResult GetMainDepartmentList()
        {
            return new JsonResult(_org.GetDepartmentList());
        }

        [HttpGet("GetLocation")]
        public IActionResult GetLocation()
        {
            return new JsonResult(_org.GetLocationList());
        }

        [HttpGet("GetDesignationList")]
        public IActionResult GetDesignationList()
        {
            return new JsonResult(_org.GetDesignationList());
        }

        [HttpGet("GetBankList")]
        public IActionResult GetBankList()
        {
            return new JsonResult(_org.GetBankList());
        }
    }
}
