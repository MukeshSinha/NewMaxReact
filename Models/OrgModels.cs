using System;

namespace NewMaxReact.Models
{
    public class Department
    {
        public int DeptID { get; set; }
        public string? Dept { get; set; }
        public string? MainDepartment { get; set; }
    }

    public class Location
    {
        public string? loc { get; set; }
    }

    public class Designation
    {
        public string? Desig { get; set; }
    }

    public class Master_Bank
    {
        public int id { get; set; }
        public string? BName { get; set; }
    }

    public class LeaveRequestModel
    {
        public string EmpCode { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public string FromDate { get; set; } = string.Empty;
        public string ToDate { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
    }

    public class ShiftRosterImportModel
    {
        public string EmpCode { get; set; } = string.Empty;
        public string ShiftCode { get; set; } = string.Empty;
        public string EffectiveDate { get; set; } = string.Empty;
    }

    public class OrgConfigModel
    {
        public string CompanyName { get; set; } = string.Empty;
        public string PlantLocation { get; set; } = string.Empty;
        public string UnitCode { get; set; } = string.Empty;
    }
}
