using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShiftController : Controller
    {
        [HttpGet("ImportShiftRoster")]
        public ActionResult ImportShiftRoster()
        {
            return Ok();
        }

        [HttpPost("ImportShiftRosterFile")]
        public IActionResult ImportShiftRosterFile([FromBody] ShiftRosterImportModel model)
        {
            var res = new { success = true, message = $"Shift roster for {model?.EmpCode} imported successfully" };
            return new JsonResult(res);
        }

        [HttpGet("Index")]
        public ActionResult Index()
        {
            return Ok();
        }

        [HttpGet("Details/{id}")]
        public ActionResult Details(int id)
        {
            return Ok();
        }

        [HttpGet("Create")]
        public ActionResult Create()
        {
            return Ok();
        }

        [HttpGet("Edit/{id}")]
        public ActionResult Edit(int id)
        {
            return Ok();
        }

        [HttpDelete("Delete/{id}")]
        public ActionResult Delete(int id)
        {
            return Ok();
        }
    }
}
