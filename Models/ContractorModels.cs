using System;

namespace NewMaxReact.Models
{
    public class ListItem
    {
        public int id { get; set; }
        public string? ItemName { get; set; }
    }

    public class ContractorTodayManpower
    {
        public string ezone { get; set; } = string.Empty;
        public double Regular { get; set; }
        public double FOT { get; set; }
        public double TOA { get; set; }
        public double total { get; set; }
    }

    public class ContractorDeptManpower
    {
        public string Dept { get; set; } = string.Empty;
        public double Regular { get; set; }
        public double Fot { get; set; }
        public double Toa { get; set; }
        public double TotalManpower { get; set; }
        public double ApiReg { get; set; }
        public double ApiFot { get; set; }
        public double ApiToa { get; set; }
        public double ApiTotal { get; set; }
    }

    public class ContractorOnRoll
    {
        public string Category { get; set; } = string.Empty;
        public int LastMonth { get; set; }
        public int NewJoin { get; set; }
        public int leave { get; set; }
        public int Balance { get; set; }
    }

    public class Contractors
    {
        public int ContractorID { get; set; }
        public string ContractorName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Telephone { get; set; }
        public string? ContactPerson { get; set; }
        public string? EmerjencyNumber { get; set; }
        public string? Gstn { get; set; }
        public string? ServiceNo { get; set; }
        public string? Pfno { get; set; }
        public string? EsiNo { get; set; }
        public DateTime DateOfReg { get; set; }
        public DateTime? EnrollDate { get; set; }
        public string? RegisterationNumber { get; set; }
        public int IsActive { get; set; }
    }

    public class ContractorRegistrationModel
    {
        public int CompID { get; set; }
        public string CompName { get; set; } = string.Empty;
        public string LicenseNo { get; set; } = string.Empty;
        public string GSTNo { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}
