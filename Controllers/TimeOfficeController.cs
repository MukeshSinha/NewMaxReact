using Microsoft.AspNetCore.Mvc;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimeOfficeController : Controller
    {
        [HttpGet("WeekoffTransfers")]
        public IActionResult GetWeekoffTransfers()
        {
            return Ok(new List<object>());
        }

        [HttpPost("WeekoffTransfer")]
        public IActionResult SubmitWeekoffTransfer([FromBody] object body)
        {
            return Ok(new { success = true, message = "Weekoff transfer registered successfully" });
        }

        [HttpGet("ForgetPunchList")]
        public IActionResult GetForgetPunchList()
        {
            return Ok(new List<object>());
        }

        [HttpPost("ForgetPunch")]
        public IActionResult SubmitForgetPunch([FromBody] object body)
        {
            return Ok(new { success = true, message = "Forget punch regularization submitted successfully" });
        }
    }
}

