using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;
using NPOI.SS.Formula.Functions;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimeOfficeController : Controller
    {
        private readonly IWoTransfer _woTransfer;
        public TimeOfficeController(IWoTransfer woTransfer)
        {
            _woTransfer = woTransfer;
        }
        [HttpGet("WeekoffTransfers")]
        public IActionResult GetWeekoffTransfers()
        {
            return Ok(new List<object>());
        }

        [HttpPost("WeekoffTransfer")]
        public IActionResult SubmitWeekoffTransfer([FromBody] WoffTransfer body)
        {
            try
            {
                if (body == null)
                    return BadRequest("Request body is null");

                var res = _woTransfer.SaveWoffTransfer(body);

                return Ok(res);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());

                return StatusCode(500, new
                {
                    message = ex.Message,
                    details = ex.ToString()
                });
            }
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

