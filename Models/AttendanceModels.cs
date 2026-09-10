using System;

namespace NewMaxReact.Models
{
    public class AttendanceRecordDto
    {
        public string EmpCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Contractor { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string PunchTime { get; set; } = string.Empty;
        public string PrevPunchTime { get; set; } = string.Empty;
        public string Shift { get; set; } = "A";
        public string Status { get; set; } = "Present";
        public string VerificationStatus { get; set; } = "Pending";
    }

    public class PunchProcessRequest
    {
        public string ProcessDate { get; set; } = string.Empty;
        public string ShiftCode { get; set; } = "ALL";
    }

    public class AttendanceVerifyRequest
    {
        public string EmpCode { get; set; } = string.Empty;
        public string VerificationDate { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }

    public class MusterRollReportDto
    {
        public string EmpCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Contractor { get; set; } = string.Empty;
        public string Dept { get; set; } = string.Empty;
        public int PDays { get; set; }
        public int ADays { get; set; }
        public int WOff { get; set; }
        public double OTHrs { get; set; }
    }

    public class CategoryAttendance
    {
        public double Regular { get; set; }
        public double FOT { get; set; }
        public double TOA { get; set; }
        public double RollReg { get; set; }
        public double RollFot { get; set; }
        public double RollToa { get; set; }
    }

    public class DeptWiseCategoryWiseAttendance
    {
        public string? Dept { get; set; }
        public double Regular { get; set; }
        public double FOT { get; set; }
        public double TOA { get; set; }
        public double Total { get; set; }
    }

    public class ShiftWiseAttendance
    {
        public string? Dept { get; set; }
        public double Ashift { get; set; }
        public double Gshift { get; set; }
        public double Bshift { get; set; }
        public double Cshift { get; set; }
        public double Total { get; set; }
    }

    public class DeptwiseApiManpower
    {
        public string? Dept { get; set; }
        public double regular { get; set; }
        public double fot { get; set; }
        public double toa { get; set; }
        public double Total { get; set; }
        public double regularApi { get; set; }
        public double fotApi { get; set; }
        public double toaApi { get; set; }
        public double totalApi { get; set; }
    }

    public class EmployeeAttendance
    {
        public string? Ezone { get; set; }
        public string? EmpCode { get; set; }
        public string? EmpName { get; set; }
        public DateTime? attDate { get; set; }
        public string? Department { get; set; }
        public string? Category { get; set; }
        public string? InTime { get; set; }
        public string? OutTime { get; set; }
        public string? Shift { get; set; }
        public string? WorkHrs { get; set; }
        public string? ApiHrs { get; set; }
        public string? attStatus { get; set; }
    }

    public class musterRoll
    {
        public string EmpCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Dept { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? dt1 { get; set; }
        public string? dt2 { get; set; }
        public string? dt3 { get; set; }
        public string? dt4 { get; set; }
        public string? dt5 { get; set; }
        public string? dt6 { get; set; }
        public string? dt7 { get; set; }
        public string? dt8 { get; set; }
        public string? dt9 { get; set; }
        public string? dt10 { get; set; }
        public string? dt11 { get; set; }
        public string? dt12 { get; set; }
        public string? dt13 { get; set; }
        public string? dt14 { get; set; }
        public string? dt15 { get; set; }
        public string? dt16 { get; set; }
        public string? dt17 { get; set; }
        public string? dt18 { get; set; }
        public string? dt19 { get; set; }
        public string? dt20 { get; set; }
        public string? dt21 { get; set; }
        public string? dt22 { get; set; }
        public string? dt23 { get; set; }
        public string? dt24 { get; set; }
        public string? dt25 { get; set; }
        public string? dt26 { get; set; }
        public string? dt27 { get; set; }
        public string? dt28 { get; set; }
        public string? dt29 { get; set; }
        public string? dt30 { get; set; }
        public string? dt31 { get; set; }
    }
}
