using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeptVerificationController : Controller
    {
        private readonly IAttendanceReport _attRep;

        public DeptVerificationController(IAttendanceReport attRep)
        {
            _attRep = attRep;
        }

        [HttpGet("GetPresentList")]
        [HttpGet("GetPendingPunches")]
        public ActionResult GetPresentList(DateTime Fdt, string Dept, string sft) => new JsonResult(_attRep.GetAttendanceForVerification(Fdt, Dept, sft, HttpContext.Session.GetString("Username") ?? "AdminUser"));
    }
}
