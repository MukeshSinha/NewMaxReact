using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;
using System;
using System.Data;
using Newtonsoft.Json;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceReportLayoutController : Controller
    {
        private readonly IAttendanceReport _attReport;

        public AttendanceReportLayoutController(IAttendanceReport attReport)
        {
            _attReport = attReport;
        }

        [HttpGet("AttendanceReportLayout")]
        public ActionResult AttendanceReportLayout()
        {
            return Ok();
        }

        [HttpGet("ShiftWiseAttendance")]
        public ActionResult ShiftWiseAttendance()
        {
            return Ok();
        }

        [HttpGet("TodayAttendance")]
        public ActionResult TodayAttendance()
        {
            var res = _attReport.TodayCategoryWiseHeadCount();
            return new JsonResult(res);
        }

        [HttpGet("DailyDeptCategoryWiseAttendance")]
        public ActionResult DailyDeptCategoryWiseAttendance()
        {
            return Ok();
        }

        [HttpGet("DeptWiseCategoryWiseAttendance")]
        public ActionResult DeptWiseCategoryWiseAttendance(DateTime ForDate)
        {
            var username = HttpContext.Session.GetString("Username") ?? "AdminUser";
            var res = _attReport.DeptCategoryWiseHeadCount(ForDate, username);
            return new JsonResult(res);
        }

        [HttpGet("GetShiftWiseAttendance")]
        public ActionResult GetShiftWiseAttendance(DateTime Dt, string etype)
        {
            var username = HttpContext.Session.GetString("Username") ?? "AdminUser";
            var res = _attReport.GetShiftWiseHeadCount(Dt, etype, username);
            return new JsonResult(res);
        }

        [HttpGet("DepartmentwiseApiManpower")]
        public ActionResult DepartmentwiseApiManpower()
        {
            return Ok();
        }

        [HttpGet("DepartmentwiseApi")]
        public ActionResult DepartmentwiseApi(DateTime Dt)
        {
            var res = _attReport.GetDeptwiseApi(Dt);
            return new JsonResult(res);
        }

        [HttpGet("PeriodicApiManpower")]
        public ActionResult PeriodicApiManpower()
        {
            return Ok();
        }

        [HttpGet("PeriodicApiManpowerReport")]
        public ActionResult PeriodicApiManpowerReport(DateTime Dt, DateTime UpToDate)
        {
            var username = HttpContext.Session.GetString("Username") ?? "AdminUser";
            var res = _attReport.GetPeriodicApi(Dt, UpToDate, username);
            return new JsonResult(res);
        }

        [HttpGet("ShiftwisePlanVsActual")]
        public ActionResult ShiftwisePlanVsActual()
        {
            return Ok();
        }

        [HttpGet("DeptWisePlanVsActual")]
        public ActionResult DeptWisePlanVsActual(DateTime forDate)
        {
            DataTable rs = _attReport.DeptWisePlanVsActual(forDate, HttpContext.Session.GetString("Username") ?? "AdminUser");
            string res = JsonConvert.SerializeObject(rs);
            return new JsonResult(res);
        }

        [HttpGet("DailyAbsenteeism")]
        public ActionResult DailyAbsenteeism()
        {
            return Ok();
        }

        [HttpGet("DailyDeptAbsenteeism")]
        public ActionResult DailyDeptAbsenteeism(DateTime forDate)
        {
            DataTable rs = _attReport.DeptWisePlanVsActual(forDate, HttpContext.Session.GetString("Username") ?? "AdminUser");
            string res = JsonConvert.SerializeObject(rs);
            return new JsonResult(res);
        }

        [HttpGet("GetMusterRoll")]
        public ActionResult GetMusterRoll()
        {
            return Ok();
        }

        [HttpGet("MusterRoll")]
        public ActionResult MusterRoll(DateTime fromDate, DateTime ToDate, string? Ezone = null)
        {
            return new JsonResult(_attReport.MusterRoll(fromDate, ToDate, Ezone ?? HttpContext.Session.GetString("Username") ?? "ALL"));
        }

        [HttpGet("DeptwiseManpowerALL")]
        public ActionResult DeptwiseManpowerALL(DateTime? dt = null)
        {
            var res = dt.HasValue ? _attReport.GetDeptwiseManpowerDashboard(dt.Value) : _attReport.GetDeptwiseManpowerDashboard();
            return new JsonResult(res);
        }

        [HttpGet("DeptwiseManpowerALLForDept")]
        public ActionResult DeptwiseManpowerALLForDept(DateTime? dt = null)
        {
            var res = dt.HasValue
                ? _attReport.GetDeptwiseManpowerDashboardForDept(HttpContext.Session.GetString("Username") ?? "AdminUser", dt.Value)
                : _attReport.GetDeptwiseManpowerDashboardForDept(HttpContext.Session.GetString("Username") ?? "AdminUser");
            return new JsonResult(res);
        }

        [HttpGet("DeptwiseManpowerALLByDate")]
        public ActionResult DeptwiseManpowerALLByDate(DateTime Dt)
        {
            var res = _attReport.GetDeptwiseManpowerDashboard(Dt);
            return new JsonResult(res);
        }

        [HttpGet("DeptwiseManpowerALLByDateForDept")]
        public ActionResult DeptwiseManpowerALLByDateForDept(DateTime Dt)
        {
            var res = _attReport.GetDeptwiseManpowerDashboardForDept(HttpContext.Session.GetString("Username") ?? "AdminUser", Dt);
            return new JsonResult(res);
        }

        [HttpGet("DailyArrivalReport")]
        public ActionResult DailyArrivalReport()
        {
            return Ok();
        }

        [HttpGet("DailyArrival")]
        public ActionResult DailyArrival(DateTime Dt, string ezone)
        {
            var res = _attReport.GetDailyArrival(Dt, ezone, HttpContext.Session.GetString("Username") ?? "AdminUser");
            return new JsonResult(res);
        }

        [HttpGet("GetEmployeeAttendancequery")]
        public ActionResult GetEmployeeAttendancequery(string EmpCode, DateTime FDt, DateTime ToDt)
        {
            var res = _attReport.GetIndividualAttendance(EmpCode, FDt, ToDt);
            return new JsonResult(res);
        }

        [HttpGet("IndividualAttendance")]
        public ActionResult IndividualAttendance()
        {
            return Ok();
        }

        [HttpGet("GetContractorCategoryWise")]
        public ActionResult GetContractorCategoryWise(DateTime Dt)
        {
            return Ok();
        }
    }
}
