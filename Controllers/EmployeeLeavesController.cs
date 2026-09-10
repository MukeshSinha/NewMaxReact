using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeLeavesController : Controller
    {
        [HttpPost("PostLeave")]
        public IActionResult PostLeave([FromBody] LeaveRequestModel model)
        {
            var res = new { success = true, message = $"Leave request for {model?.EmpCode} posted successfully" };
            return new JsonResult(res);
        }
    }
}
