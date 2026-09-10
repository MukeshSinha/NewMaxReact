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
        private readonly IOrgStructure _org;

        public DeptVerificationController(IAttendanceReport attRep, IOrgStructure org)
        {
            _attRep = attRep;
            _org = org;
        }

        [HttpGet("GetDepartmentList")]
        public ActionResult GetDepartmentList()
        {
            return new JsonResult(_org.GetDepartmentList());
        }

        [HttpGet("GetPresentList")]
        [HttpGet("GetPendingPunches")]
        [HttpGet("GetAttendanceVerifyList")]
        public ActionResult GetPresentList(DateTime? Fdt, string? Dept, string? sft, DateTime? dt, string? dept, string? shift)
        {
            var date = Fdt ?? dt ?? DateTime.Today;
            var department = Dept ?? dept ?? "ALL";
            var shiftVal = sft ?? shift ?? "ALL";
            var username = HttpContext.Session.GetString("Username") ?? "AdminUser";
            return new JsonResult(_attRep.GetAttendanceForVerification(date, department, shiftVal, username));
        }

        [HttpPost("VerifyAttendance")]
        public ActionResult VerifyAttendance([FromBody] VerifyRequest request)
        {
            return Ok(new { success = true, verifiedCount = request?.Ids?.Count ?? 0 });
        }
    }

    public class VerifyRequest
    {
        public List<string>? Ids { get; set; }
    }
}
