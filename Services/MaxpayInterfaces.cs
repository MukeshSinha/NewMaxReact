using System;
using System.Collections.Generic;
using System.Data;
using NewMaxReact.Models;

namespace NewMaxReact.Services
{
    public interface IAttendanceProcess
    {
        int PunchProcess(PunchProcessRequest punchreq);
    }

    public interface IEmployees
    {
        string SaveEmployee(Employees emp);
        int SavePersonalInfo(EmployeePersonal empPersonal);
        int SaveEmpAddress(EmpAddress empAddress);
        IEnumerable<EmployeePersonal> GetPersonalInfo(string empCode);
        IEnumerable<EmpAddress> GetEmployeeAddress(string empCode);
        IEnumerable<Employees> SearchEmployee(string employeeId);
        IEnumerable<Employees> GetEmployeeList(string companyName, int choice, string username);
        IEnumerable<Employees> GetEmployeeListBetweenDate(string companyName, DateTime FromDate, DateTime UptoDate, int Choice);
        IEnumerable<Employees> GetEmployeeListByCategory(string companyName, string category, string Dept);
    }

    public interface IUserManage
    {
        UserRole verifyUser(userInfo usr);
        int UpdatePassword(userInfo usr);
        LoginResponseDto verifyUser(LoginRequestDto usr);
        int UpdatePassword(ChangePasswordModel usr);
    }

    public interface IAttendanceReport
    {
        IEnumerable<musterRoll> MusterRoll(DateTime fromDate, DateTime ToDate, string Ezone);
        List<EmployeeAttendance> GetAttendanceForVerification(DateTime forDate, string Department, string shift, string userName);
        List<CategoryAttendance> TodayCategoryWiseHeadCount();
        List<DeptWiseCategoryWiseAttendance> DeptCategoryWiseHeadCount(DateTime forDate, string userName);
        List<ShiftWiseAttendance> GetShiftWiseHeadCount(DateTime ForDate, string Etype, string userName);
        List<DeptwiseApiManpower> GetDeptwiseApi(DateTime ForDate);
        List<DeptwiseApiManpower> GetPeriodicApi(DateTime ForDate, DateTime UptoDate, string UserName);
        DataTable DeptWisePlanVsActual(DateTime forDate, string UserName);
        DataTable DailyDeptAbsenteeism(DateTime forDate);
        List<DeptwiseApiManpower> GetDeptwiseManpowerDashboard(DateTime? ForDate = null);
        List<DeptwiseApiManpower> GetDeptwiseManpowerDashboardForDept(string? username = null, DateTime? ForDate = null);
        List<EmployeeAttendance> GetDailyArrival(DateTime forDate, string ezone, string username);
        List<EmployeeAttendance> GetIndividualAttendance(string EmpCode, DateTime forDate, DateTime ToDt);
    }

    public interface IContractor
    {
        int RegisterContractor(Contractors contractors);
        IEnumerable<ListItem> GetContractorList(string username);
        IEnumerable<ContractorOnRoll> GetContractorStrength(string username);
        IEnumerable<ContractorTodayManpower> TodayContractorManpower(string username, DateTime? dt = null);
        IEnumerable<ContractorTodayManpower> TodayALLContractorManpower(DateTime? dt = null);
        IEnumerable<ContractorTodayManpower> TodayALLContractorManpowerForDept(string UserName, DateTime? dt = null);
        IEnumerable<ContractorDeptManpower> DeptContractorManpower(string username, DateTime? dts = null);
    }

    public interface IOrgStructure
    {
        IEnumerable<Department> GetDepartmentList();
        IEnumerable<Location> GetLocationList();
        IEnumerable<Designation> GetDesignationList();
        IEnumerable<Master_Bank> GetBankList();
    }

    public interface IMastersImport
    {
        void ImportEmployeeFromExcel(List<Employees> employees);
        void ImportEmployeeFromExcel(List<EmployeeDto> employees);
    }

    public interface ITempEmp
    {
        string SaveTempEmployee(TempEmployee emp);
        string SaveTempEmpAddress(TempAddress tempAddress);
        IEnumerable<TempEmployee> SearchTempEmployeeBytCode(string tmpCode);
        IEnumerable<TempEmployee> getTempEmployeeList(string ezn);
        IEnumerable<TempEmployee> TempEmpListForPromote(DateTime dt);
        IEnumerable<DojoResult> getDojoResult(DateTime dt);
        IEnumerable<DojoResult> getDojoFullList(DateTime dt);
        int SaveTempEmpHandover(List<PromotionResultDTO> pdto, DateTime PassDate);
        DataTable getDojoEmployee(DateTime dt);
        byte[] GenerateDojoCretificate(DataTable model);
    }
}
