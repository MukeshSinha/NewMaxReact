using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MasterController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IMastersImport _master;

        public MasterController(IWebHostEnvironment hostEnvironment, IMastersImport mastersImport)
        {
            _hostingEnvironment = hostEnvironment;
            _master = mastersImport;
        }

        [HttpGet("ImportEmployeesFromExcel")]
        [HttpGet("/ImportMasters/Master/ImportEmployeesFromExcel")]
        public IActionResult ImportEmployeesFromExcel()
        {
            return Ok();
        }

        [HttpGet("Dojo")]
        [HttpGet("/ImportMasters/Master/Dojo")]
        public IActionResult Dojo()
        {
            return Ok();
        }

        [HttpPost("ImportEmpGeneralInfo")]
        [HttpPost("/ImportMasters/Master/ImportEmpGeneralInfo")]
        public IActionResult ImportEmpGeneralInfo()
        {
            int hd;
            List<Employees> Result = new List<Employees>();
            try
            {
                if (Request.Form.Files.Count > 0)
                {
                    IFormFile file = Request.Form.Files[0];
                    string folderName = "UploadExcel";
                    string webRootPath = _hostingEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                    string newPath = Path.Combine(webRootPath, folderName);
                    if (!Directory.Exists(newPath))
                    {
                        Directory.CreateDirectory(newPath);
                    }
                    if (file.Length > 0)
                    {
                        string sFileExtension = Path.GetExtension(file.FileName).ToLower();
                        ISheet sheet;
                        string fullPath = Path.Combine(newPath, file.FileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                            stream.Position = 0;
                            if (sFileExtension == ".xls")
                            {
                                HSSFWorkbook hssfwb = new HSSFWorkbook(stream); // This will read the Excel 97-2000 formats  
                                sheet = hssfwb.GetSheetAt(0); // get first sheet from workbook  
                            }
                            else
                            {
                                XSSFWorkbook hssfwb = new XSSFWorkbook(stream); // This will read 2007 Excel format  
                                sheet = hssfwb.GetSheetAt(0); // get first sheet from workbook   
                            }

                            IRow headerRow = sheet.GetRow(0); // Get Header Row
                            int cellCount = headerRow != null ? headerRow.LastCellNum : 0;

                            for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++) // Read Excel File
                            {
                                hd = 1;
                                IRow row = sheet.GetRow(i);
                                if (row == null) continue;

                                if (row.Cells.All(d => d.CellType == CellType.Blank)) continue;

                                int j = 0;
                                if ((row.GetCell(j) != null && (hd < cellCount)))
                                {
                                    ICell cell = row.GetCell(22, MissingCellPolicy.CREATE_NULL_AS_BLANK);

                                    DateTime? parsedLeaveDate = string.IsNullOrWhiteSpace(cell.ToString())
                                        ? (DateTime?)null
                                        : DateTime.TryParseExact(cell.ToString(), "dd-MMM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime tempDate)
                                            ? tempDate
                                            : (DateTime?)null;
                                    Result.Add(new Employees
                                    {
                                        EmpCode = (row.GetCell(0, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Ezn = (row.GetCell(1, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        loc = (row.GetCell(2, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        EmpCategory = (row.GetCell(3, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        EmpType = (row.GetCell(4, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        EmpName = (row.GetCell(5, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        FatherName = (row.GetCell(6, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Dob = DateTime.TryParseExact(row.GetCell(7)?.ToString(), "dd-MMM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dobDate) ? dobDate : DateTime.MinValue,
                                        Doj = DateTime.TryParseExact(row.GetCell(8)?.ToString(), "dd-MMM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dojDate) ? dojDate : DateTime.MinValue,
                                        saltype = (row.GetCell(9, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        costcentre = (row.GetCell(10, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        dept = (row.GetCell(11, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        desig = (row.GetCell(12, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        grd = (row.GetCell(13, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Mop = (row.GetCell(14, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        contact = (row.GetCell(15, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        refr = (row.GetCell(16, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Aadhar = (row.GetCell(17, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Pan = (row.GetCell(18, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Uan = (row.GetCell(19, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Esi = (row.GetCell(20, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Dispencry = (row.GetCell(21, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        LeaveDate = parsedLeaveDate,
                                        BankName = (row.GetCell(23, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        BankAcno = (row.GetCell(24, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        IFSC = (row.GetCell(25, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim(),
                                        Cardno = (row.GetCell(26, MissingCellPolicy.CREATE_NULL_AS_BLANK).ToString() ?? "").Trim()
                                    });
                                }
                                hd = hd + 1;
                            }
                        }
                    }
                    _master.ImportEmployeeFromExcel(Result);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ImportEmpGeneralInfo error: {ex.Message}");
            }
            return new JsonResult("");
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
