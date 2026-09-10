using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceProcessController : Controller
    {
        private readonly IAttendanceProcess _att;

        public AttendanceProcessController(IAttendanceProcess att)
        {
            _att = att;
        }

        [HttpPost("Punchprocessing")]
        [HttpPost("ProcessPunches")]
        [HttpPost("PunchProcess")]
        public IActionResult Punchprocessing([FromBody] PunchProcessRequest request)
        {
            return new JsonResult(_att.PunchProcess(request));
        }
    }
}
