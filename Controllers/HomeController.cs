using Microsoft.AspNetCore.Mvc;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        [HttpGet("Index")]
        public IActionResult Index()
        {
            return Ok();
        }

        [HttpGet("contractorDashboard")]
        public IActionResult contractorDashboard()
        {
            return Ok();
        }

        [HttpGet("DepartmentDashboard")]
        public IActionResult DepartmentDashboard()
        {
            return Ok();
        }

        [HttpGet("Login")]
        public IActionResult Login()
        {
            return Ok();
        }

        [HttpGet("DojoDashboard")]
        public IActionResult DojoDashboard()
        {
            return Ok();
        }

        [HttpGet("Privacy")]
        public IActionResult Privacy()
        {
            return Ok();
        }
    }
}
