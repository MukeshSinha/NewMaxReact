using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;
using System;
using System.Collections.Generic;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TempJoinController : Controller
    {
        private readonly ITempEmp _tempEmp;

        public TempJoinController(ITempEmp tempEmp)
        {
            _tempEmp = tempEmp;
        }

        [HttpGet("TempJoining")]
        public IActionResult TempJoining()
        {
            return Ok();
        }

        [HttpPost("SaveTempEmp")]
        public IActionResult SaveTempEmp([FromBody] TempEmployee employee)
        {
            return new JsonResult(_tempEmp.SaveTempEmployee(employee));
        }

        [HttpGet("SearchTempEmpBytCode")]
        public IActionResult SearchTempEmpBytCode(string tmpCode)
        {
            return new JsonResult(_tempEmp.SearchTempEmployeeBytCode(tmpCode));
        }

        [HttpGet("getTempJoinList")]
        public IActionResult getTempJoinList(string Ezone)
        {
            return new JsonResult(_tempEmp.getTempEmployeeList(Ezone));
        }

        [HttpGet("PromoteTempEmployee")]
        public IActionResult PromoteTempEmployee()
        {
            return Ok();
        }

        [HttpGet("ListToPromoteTempEmployee")]
        public IActionResult ListToPromoteTempEmployee(DateTime Doj)
        {
            return new JsonResult(_tempEmp.TempEmpListForPromote(Doj));
        }

        [HttpPost("SavePromotionResult")]
        public ActionResult SavePromotionResult([FromBody] PromotionResultRequest request)
        {
            if (request == null || request.Model == null || request.Model.Count == 0)
                return Json("No data received");

            return Json(_tempEmp.SaveTempEmpHandover(request.Model, request.Passdt));
        }

        [HttpGet("ResultList")]
        [HttpGet("/Employee/TempJoin/ResultList")]
        public IActionResult ResultList()
        {
            return Ok();
        }

        [HttpGet("getDojoResultList")]
        [HttpGet("/Employee/TempJoin/getDojoResultList")]
        public IActionResult getDojoResultList(DateTime Doj)
        {
            return new JsonResult(_tempEmp.getDojoResult(Doj));
        }

        [HttpGet("PrintDojoResult")]
        [HttpGet("/Employee/TempJoin/PrintDojoResult")]
        public ActionResult PrintDojoResult(DateTime Dt)
        {
            try
            {
                var data = _tempEmp.getDojoEmployee(Dt);

                if (data == null || data.Rows.Count == 0)
                    return Content("No data found for selected date.");

                byte[] pdfBytes = _tempEmp.GenerateDojoCretificate(data);

                if (pdfBytes == null || pdfBytes.Length == 0)
                    return Content("PDF generation failed.");

                return File(pdfBytes, "application/pdf", "DojoResult_" + Dt.ToString("dd-MM-yyyy") + ".pdf");
            }
            catch (Exception ex)
            {
                return Content("Error occurred: " + ex.Message);
            }
        }

        [HttpGet("getListDojo")]
        public IActionResult getListDojo()
        {
            return Ok();
        }

        [HttpGet("getDojoFullList")]
        public IActionResult getDojoFullList(DateTime Doj)
        {
            return new JsonResult(_tempEmp.getDojoFullList(Doj));
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
