using System;

namespace NewMaxReact.Models
{
    public class EmpAddress
    {
        public string? EmpCode { get; set; }
        public string? C_Village { get; set; }
        public string? C_Post { get; set; }
        public string? C_Dist { get; set; }
        public string? C_State { get; set; }
        public string? C_Pin { get; set; }
        public string? P_Village { get; set; }
        public string? P_Post { get; set; }
        public string? P_Dist { get; set; }
        public string? P_State { get; set; }
        public string? P_Pin { get; set; }
    }

    public class EmployeeDto
    {
        public string? EmpCode { get; set; }
        public string? Name { get; set; }
        public string? EmpName { get => Name; set => Name = value; }
        public string? FatherName { get; set; }
        public string? Gender { get; set; }
        public string? Category { get; set; }
        public string? Contractor { get; set; }
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public string? Mobile { get; set; }
        public string? Contact { get => Mobile; set => Mobile = value; }
        public string? Aadhar { get; set; }
        public string? Pan { get; set; }
        public string? BankAccount { get; set; }
        public string? JoiningDate { get; set; }
        public string? Status { get; set; }
        public string? DojoStatus { get; set; }
    }

    public class EmployeePersonal
    {
        public string EmpCode { get; set; } = string.Empty;
        public string Religion { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Marital { get; set; } = string.Empty;
        public string bGroup { get; set; } = string.Empty;
        public string EmergencyNo { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string shoesize { get; set; } = string.Empty;
    }

    public class NewEmployeeRegistrationModel
    {
        public string? EmpCode { get; set; }
        public string? EmpName { get; set; }
        public string? Name { get => EmpName; set => EmpName = value; }
        public string? FatherName { get; set; }
        public string? Gender { get; set; }
        public string? Dob { get; set; }
        public string? Doj { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? Dept { get; set; }
        public string? Department { get => Dept; set => Dept = value; }
        public string? Desig { get; set; }
        public string? Designation { get => Desig; set => Desig = value; }
        public string? Category { get; set; }
        public string? Contractor { get; set; }
        public string? Aadhar { get; set; }
        public string? Pan { get; set; }
        public string? BankAcno { get; set; }
        public string? BankAccount { get => BankAcno; set => BankAcno = value; }
        public string? IFSC { get; set; }
    }

    public class DutyTransferModel
    {
        public string? EmpCode { get; set; }
        public string? CurrentDept { get; set; }
        public string? NewDept { get; set; }
        public string? TransferDate { get; set; }
        public string? Reason { get; set; }
    }

    public class PromotionModel
    {
        public string? EmpCode { get; set; }
        public string? CurrentDesignation { get; set; }
        public string? NewDesignation { get; set; }
        public string? PromotionDate { get; set; }
        public string? Remarks { get; set; }
    }

    public class Employees
    {
        public string? EmpCode { get; set; }
        public string? Ezn { get; set; }
        public string? loc { get; set; }
        public string? EmpCategory { get; set; }
        public string? EmpType { get; set; }
        public string? EmpName { get; set; }
        public string? FatherName { get; set; }
        public DateTime Dob { get; set; }
        public DateTime Doj { get; set; }
        public string? saltype { get; set; }
        public string? costcentre { get; set; } = null;
        public string? dept { get; set; }
        public string? Subdept { get; set; }
        public string? desig { get; set; }
        public string? grd { get; set; }
        public string? Mop { get; set; } = null;
        public string? contact { get; set; } = null;
        public string? refr { get; set; } = null;
        public string? Aadhar { get; set; } = null;
        public string? Pan { get; set; } = null;
        public string? Uan { get; set; } = null;
        public string? Esi { get; set; } = null;
        public string? Dispencry { get; set; }
        public DateTime? LeaveDate { get; set; } = null;
        public string? BankName { get; set; } = null;
        public string? BankAcno { get; set; } = null;
        public string? IFSC { get; set; } = null;
        public string? Status { get; set; } = null;
        public string? Cardno { get; set; }
        public DateTime? LastPresent { get; set; } = null;
    }

    public class TempEmployee
    {
        public string? Ezn { get; set; }
        public string? TempCode { get; set; }
        public string? Category { get; set; }
        public string? EmpType { get; set; }
        public string? EmpName { get; set; }
        public string? FatherName { get; set; }
        public DateTime Dob { get; set; }
        public DateTime Doj { get; set; }
        public string? dept { get; set; }
        public string? contact { get; set; }
        public string? refr { get; set; }
        public string? Aadhar { get; set; }
        public string? Pan { get; set; }
    }

    public class TempAddress
    {
        public string EmpCode { get; set; } = string.Empty;
        public string C_Vill { get; set; } = string.Empty;
        public string HouseNo { get; set; } = string.Empty;
        public string? PO { get; set; }
        public string? PS { get; set; }
        public string? Dist { get; set; }
        public string? State { get; set; }
        public string? PinCode { get; set; }
    }

    public class DojoResult
    {
        public string? Ezn { get; set; }
        public string? empCode { get; set; }
        public string? EmpName { get; set; }
        public string? FatherName { get; set; }
        public DateTime? Dob { get; set; } = null;
        public DateTime? Doj { get; set; } = null;
        public DateTime? SelectDate { get; set; } = null;
        public string? Dept { get; set; } = null;
        public DateTime? Ldt { get; set; } = null;
        public double? marks { get; set; }
        public string? sts { get; set; }
    }

    public class PromotionResultDTO
    {
        public string EmpCode { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public double Marks { get; set; }
    }

    public class PromotionResultRequest
    {
        public List<PromotionResultDTO>? Model { get; set; }
        public DateTime Passdt { get; set; }
    }
}
