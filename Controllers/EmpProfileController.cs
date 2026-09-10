using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpProfileController : Controller
    {
        private readonly IEmployees _emp;

        public EmpProfileController(IEmployees emp)
        {
            _emp = emp;
        }

        [HttpGet("Profile")]
        public IActionResult Profile()
        {
            return Ok();
        }

        [HttpGet("GetProfile/{empCode}")]
        public IActionResult GetProfile(string empCode)
        {
            if (string.IsNullOrWhiteSpace(empCode))
            {
                return BadRequest("Employee Code is required.");
            }

            try
            {
                // Fetch basic emp details using service
                var empList = _emp.SearchEmployee(empCode);
                var emp = empList?.FirstOrDefault();

                // Try fetching personal info
                var personalList = _emp.GetPersonalInfo(empCode);
                var personalInfo = personalList?.FirstOrDefault();

                // Try fetching address
                var addressList = _emp.GetEmployeeAddress(empCode);
                var addressInfo = addressList?.FirstOrDefault();

                var profileResponse = new
                {
                    empCode = empCode,
                    empName = emp?.EmpName ?? "",
                    fatherName = emp?.FatherName ?? "",
                    mobile = emp?.contact ?? "",
                    dob = emp?.Dob != null && emp.Dob != DateTime.MinValue ? emp.Dob.ToString("yyyy-MM-dd") : "",
                    doj = emp?.Doj != null && emp.Doj != DateTime.MinValue ? emp.Doj.ToString("yyyy-MM-dd") : "",
                    grade = emp?.grd ?? "",
                    department = emp?.dept ?? "",
                    designation = emp?.desig ?? "",
                    qualification = "",
                    gender = personalInfo?.Gender ?? "",
                    status = emp?.Status ?? "Active",
                    trainingStatus = "Completed",
                    village = addressInfo?.C_Village ?? "",
                    post = addressInfo?.C_Post ?? "",
                    district = addressInfo?.C_Dist ?? "",
                    state = addressInfo?.C_State ?? "",
                    pin = addressInfo?.C_Pin ?? "",
                    caste = "",
                    referredBy = emp?.refr ?? "",
                    attendanceSummary = new object[] { },
                    monthlyAttendance = new object[] { },
                    basicHistory = new object[] { },
                    incrementHistory = new object[] { },
                    trainings = new object[] { },
                    ratings = new object[] { },
                    appraisals = new object[] { },
                    nominees = new object[] { }
                };

                return new JsonResult(profileResponse);
            }
            catch
            {
                return new JsonResult(new
                {
                    empCode = empCode,
                    empName = "",
                    fatherName = "",
                    mobile = "",
                    dob = "",
                    doj = "",
                    grade = "",
                    department = "",
                    designation = "",
                    qualification = "",
                    gender = "",
                    status = "Active",
                    trainingStatus = "Pending",
                    village = "",
                    post = "",
                    district = "",
                    state = "",
                    pin = "",
                    caste = "",
                    referredBy = "",
                    attendanceSummary = new object[] { },
                    monthlyAttendance = new object[] { },
                    basicHistory = new object[] { },
                    incrementHistory = new object[] { },
                    trainings = new object[] { },
                    ratings = new object[] { },
                    appraisals = new object[] { },
                    nominees = new object[] { }
                });
            }
        }
    }
}
