using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.Data.SqlClient;
using NewMaxReact.Models;

namespace NewMaxReact.Services
{
    public class AttendanceProcessActions : IAttendanceProcess
    {
        public int PunchProcess(PunchProcessRequest punchreq)
        {
            try
            {
                if (punchreq?.empcode != null && punchreq.empcode.Count > 0)
                {
                    DataTable dtbl = new DataTable();
                    dtbl.Columns.Add("cd", typeof(string));
                    dtbl.Columns.Add("cardno", typeof(string));
                    foreach (string cd in punchreq.empcode)
                    {
                        DataRow dr = dtbl.NewRow();
                        dr["cd"] = cd;
                        dr["cardno"] = cd;
                        dtbl.Rows.Add(dr);
                    }
                    SqlParameter[] param = new SqlParameter[4];
                    param[0] = DataLayer.AddParameter("@EmpCdpub", "1001", SqlDbType.NVarChar, 10);
                    param[1] = DataLayer.AddParameter("@AttDatepub", punchreq.FromDt != default ? punchreq.FromDt : DateTime.Today, SqlDbType.SmallDateTime, 10);
                    param[2] = DataLayer.AddParameter("@AttDatepub1", punchreq.UptoDt != default ? punchreq.UptoDt : DateTime.Today, SqlDbType.SmallDateTime, 10);
                    param[3] = DataLayer.AddParameter("@EmpList", dtbl, SqlDbType.Structured, 10);
                    DataTable Dtbl = DataLayer.ExecuteDbProcedure("[PunchProcess]", param);
                    return Dtbl != null ? Dtbl.Rows.Count : 1;
                }
                else
                {
                    SqlParameter[] param = new SqlParameter[2];
                    param[0] = DataLayer.AddParameter("@ProcessDate", punchreq?.ProcessDate ?? "", SqlDbType.NVarChar, 20);
                    param[1] = DataLayer.AddParameter("@ShiftCode", punchreq?.ShiftCode ?? "ALL", SqlDbType.NVarChar, 10);
                    DataTable dtbl = DataLayer.ExecuteDbProcedure("[sp_AttendancePunchProcessing]", param);
                    if (dtbl != null && dtbl.Rows.Count > 0)
                    {
                        return Convert.ToInt32(dtbl.Rows[0][0] ?? 1);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PunchProcess Error: {ex.Message}");
            }
            return 1;
        }
    }

    public class EmployeeActions : IEmployees
    {
        public string SaveEmployee(Employees emp)
        {
            string empCode = "0";
            if (emp != null && !string.IsNullOrEmpty(emp.EmpCode))
            {
                empCode = emp.EmpCode;
            }
            else if (emp != null)
            {
                empCode = "0";
                emp.EmpCode = "0";
            }

            SqlParameter[] param = new SqlParameter[27];
            param[0] = Data.AddParameter("@Ezone", emp?.Ezn, SqlDbType.NVarChar, 25);
            param[1] = Data.AddParameter("@Loc", emp?.loc, SqlDbType.NVarChar, 25);
            param[2] = Data.AddParameter("@Category", emp?.EmpCategory, SqlDbType.NVarChar, 15);
            param[3] = Data.AddParameter("@EType", emp?.EmpType, SqlDbType.NVarChar, 25);
            param[4] = Data.AddParameter("@EmpName", emp?.EmpName, SqlDbType.NVarChar, 25);
            param[5] = Data.AddParameter("@Fname", emp?.FatherName, SqlDbType.NVarChar, 25);
            param[6] = Data.AddParameter("@Dob", emp?.Dob, SqlDbType.SmallDateTime, 10);
            param[7] = Data.AddParameter("@Doj", emp?.Doj, SqlDbType.SmallDateTime, 10);
            param[8] = Data.AddParameter("@SalType", emp?.saltype, SqlDbType.NVarChar, 15);
            param[9] = Data.AddParameter("@CostCentre", emp?.costcentre, SqlDbType.NVarChar, 25);
            param[10] = Data.AddParameter("@Dept", emp?.dept, SqlDbType.NVarChar, 30);
            param[11] = Data.AddParameter("@Desig", emp?.desig, SqlDbType.NVarChar, 25);
            param[12] = Data.AddParameter("@Grd", emp?.grd, SqlDbType.NVarChar, 15);
            param[13] = Data.AddParameter("@Mop", emp?.Mop, SqlDbType.NVarChar, 25);
            param[14] = Data.AddParameter("@Contact", emp?.contact, SqlDbType.NVarChar, 25);
            param[15] = Data.AddParameter("@Ref", emp?.refr, SqlDbType.NVarChar, 50);
            param[16] = Data.AddParameter("@Aadhar", emp?.Aadhar, SqlDbType.NVarChar, 20);
            param[17] = Data.AddParameter("@Pan", emp?.Pan, SqlDbType.NVarChar, 25);
            param[18] = Data.AddParameter("@UAN", emp?.Uan, SqlDbType.NVarChar, 25);
            param[19] = Data.AddParameter("@Esi", emp?.Esi, SqlDbType.NVarChar, 25);
            param[20] = Data.AddParameter("@Disp", emp?.Dispencry, SqlDbType.NVarChar, 30);
            param[21] = Data.AddParameter("@CD", empCode, SqlDbType.NVarChar, 10);
            param[22] = Data.AddParameter("@BankName", emp?.BankName, SqlDbType.NVarChar, 150);
            param[23] = Data.AddParameter("@BankAcno", emp?.BankAcno, SqlDbType.NVarChar, 50);
            param[24] = Data.AddParameter("@IFSC", emp?.IFSC, SqlDbType.NVarChar, 50);
            param[25] = Data.AddParameter("@cardno", emp?.Cardno, SqlDbType.NVarChar, 10);
            param[26] = Data.AddParameter("@LeaveDay", emp?.LeaveDate, SqlDbType.SmallDateTime, 10);
            DataTable Dtbl = Data.ExecuteDbProcedure("[mp_SaveEmployee]", param);
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                empCode = Dtbl.Rows[0].Field<string>(0) ?? "0";
            }
            return empCode;
        }

        public int SavePersonalInfo(EmployeePersonal emp)
        {
            int i = 0;
            SqlParameter[] param = new SqlParameter[8];
            param[0] = Data.AddParameter("@EmpCode", emp?.EmpCode, SqlDbType.NVarChar, 10);
            param[1] = Data.AddParameter("@Religon", emp?.Religion, SqlDbType.NVarChar, 25);
            param[2] = Data.AddParameter("@Gender", emp?.Gender, SqlDbType.NVarChar, 15);
            param[3] = Data.AddParameter("@Marital", emp?.Marital, SqlDbType.NVarChar, 25);
            param[4] = Data.AddParameter("@BloodGrp", emp?.bGroup, SqlDbType.NVarChar, 25);
            param[5] = Data.AddParameter("@EmergencyNo", emp?.EmergencyNo, SqlDbType.NVarChar, 50);
            param[6] = Data.AddParameter("@Email", emp?.email, SqlDbType.NVarChar, 50);
            param[7] = Data.AddParameter("@Choice", 1, SqlDbType.Int, 10);
            DataTable Dtbl = Data.ExecuteDbProcedure("[Save_EmpPersonal]", param);
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                i = Dtbl.Rows[0].Field<int>(0);
            }
            return i;
        }

        public IEnumerable<EmployeePersonal> GetPersonalInfo(string Ecd)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = Data.AddParameter("@EmpCode", Ecd, SqlDbType.NVarChar, 10);
            DataTable Dtbl = Data.ExecuteDbProcedure("Get_EmpPersonalInfo", param);
            var Result = new List<EmployeePersonal>();
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                Result = Dtbl.AsEnumerable().Select(r => new EmployeePersonal
                {
                    Religion = r.Field<string>("Religon") ?? "",
                    Gender = r.Field<string>("Gender") ?? "",
                    Marital = r.Field<string>("Marital") ?? "",
                    bGroup = r.Field<string>("Bgroup") ?? "",
                    EmergencyNo = r.Field<string>("EmergencyNo") ?? "",
                    email = r.Field<string>("email") ?? "",
                    shoesize = r.Table.Columns.Contains("Shoesize") ? r.Field<string>("Shoesize") ?? "" : ""
                }).ToList<EmployeePersonal>();
            }
            return Result;
        }

        public int SaveEmpAddress(EmpAddress empadd)
        {
            int i = 0;
            SqlParameter[] param = new SqlParameter[11];
            param[0] = Data.AddParameter("@EmpCd", empadd?.EmpCode, SqlDbType.NVarChar, 10);
            param[1] = Data.AddParameter("@Cr_Village", empadd?.C_Village, SqlDbType.NVarChar, 25);
            param[2] = Data.AddParameter("@Cr_Post", empadd?.C_Post, SqlDbType.NVarChar, 15);
            param[3] = Data.AddParameter("@Cr_Dist", empadd?.C_Dist, SqlDbType.NVarChar, 25);
            param[4] = Data.AddParameter("@Cr_State", empadd?.P_State, SqlDbType.NVarChar, 25);
            param[5] = Data.AddParameter("@Cr_Pin", empadd?.C_Pin, SqlDbType.NVarChar, 50);
            param[6] = Data.AddParameter("@pr_Village", empadd?.P_Village, SqlDbType.NVarChar, 50);
            param[7] = Data.AddParameter("@pr_Post", empadd?.P_Post, SqlDbType.NVarChar, 50);
            param[8] = Data.AddParameter("@pr_Dist", empadd?.P_Dist, SqlDbType.NVarChar, 50);
            param[9] = Data.AddParameter("@pr_State", empadd?.P_State, SqlDbType.NVarChar, 10);
            param[10] = Data.AddParameter("@pr_Pin", empadd?.P_Pin, SqlDbType.NVarChar, 50);
            DataTable Dtbl = Data.ExecuteDbProcedure("[Save_TempEmpAddress]", param);
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                i = Dtbl.Rows[0].Field<int>(0);
            }
            return i;
        }

        public IEnumerable<EmpAddress> GetEmployeeAddress(string Ecd)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = Data.AddParameter("@EmpCode", Ecd, SqlDbType.NVarChar, 10);
            DataTable Dtbl = Data.ExecuteDbProcedure("Get_EmpAddress", param);
            var Result = new List<EmpAddress>();
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                Result = Dtbl.AsEnumerable().Select(r => new EmpAddress
                {
                    C_Village = r.Field<string>("Cr_v"),
                    C_Post = r.Field<string>("Cr_P"),
                    C_Dist = r.Field<string>("Cr_D"),
                    C_State = r.Field<string>("Cr_S"),
                    C_Pin = r.Field<string>("Cr_Pin"),
                    P_Village = r.Field<string>("Pr_v"),
                    P_Post = r.Field<string>("Pr_P"),
                    P_Dist = r.Field<string>("Pr_D"),
                    P_State = r.Field<string>("Pr_S"),
                    P_Pin = r.Field<string>("Pr_Pin")
                }).ToList<EmpAddress>();
            }
            return Result;
        }

        public virtual IEnumerable<Employees> SearchEmployee(string Ecd)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = Data.AddParameter("@EmpCode", Ecd, SqlDbType.NVarChar, 10);
            DataTable Dtbl = Data.ExecuteDbProcedure("[Get_SearchEmployee]", param);
            var Result = new List<Employees>();
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                Result = Dtbl.AsEnumerable().Select(r => new Employees
                {
                    Ezn = r.Field<string>("Ezone"),
                    loc = r.Field<string>("loc"),
                    EmpCategory = r.Field<string>("Category"),
                    EmpType = r.Field<string>("Etype"),
                    EmpName = r.Field<string>("EmpName"),
                    FatherName = r.Field<string>("FName"),
                    Dob = r.Field<DateTime>("Dob"),
                    Doj = r.Field<DateTime>("Doj"),
                    saltype = r.Field<string>("SalaryType"),
                    costcentre = r.Field<string>("CostCentre"),
                    dept = r.Field<string>("Department"),
                    desig = r.Field<string>("Desig"),
                    grd = r.Field<string>("Grade"),
                    Mop = r.Field<string>("Mop"),
                    contact = r.Field<string>("Contact"),
                    refr = r.Field<string>("ref"),
                    Aadhar = r.Field<string>("Aadhar"),
                    Pan = r.Field<string>("Pan"),
                    Uan = r.Field<string>("UAN"),
                    Esi = r.Field<string>("ESI"),
                    Dispencry = r.Field<string>("Dispencery"),
                    LeaveDate = r.Field<DateTime?>("LeaveDay"),
                    BankName = r.Field<string>("BankName"),
                    BankAcno = r.Field<string>("BankAcno"),
                    IFSC = r.Field<string>("IFSC"),
                    Cardno = r.Field<string>("Cardno"),
                }).ToList<Employees>();
            }
            return Result;
        }

        public IEnumerable<Employees> GetEmployeeList(string companyName, int choice, string uid)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = Data.AddParameter("@CompanyName", companyName, SqlDbType.NVarChar, 50);
            param[1] = Data.AddParameter("@Choice", choice, SqlDbType.Int, 5);
            param[2] = Data.AddParameter("@uid", uid, SqlDbType.NVarChar, 50);
            DataTable Dtbl = Data.ExecuteDbProcedure("[EmployeeMaster_GetList]", param);
            var Result = new List<Employees>();
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                Result = Dtbl.AsEnumerable().Select(r => new Employees
                {
                    EmpCode = r.Field<string>("EmpCode"),
                    EmpName = r.Field<string>("EmpName"),
                    FatherName = r.Field<string>("FName"),
                    dept = r.Field<string>("Department"),
                    desig = r.Field<string>("Desig"),
                    EmpCategory = r.Field<string>("Category"),
                    Dob = r.Field<DateTime>("Dob"),
                    Doj = r.Field<DateTime>("Doj"),
                    EmpType = r.Field<string>("Etype"),
                    Aadhar = r.Field<string>("Aadhar"),
                    contact = r.Field<string>("Contact"),
                    Pan = r.Field<string>("PAN"),
                    Uan = r.Field<string>("UAN"),
                    Esi = r.Field<string>("ESI"),
                    BankAcno = r.Field<string>("BankAcno"),
                    IFSC = r.Field<string>("IFSCNO"),
                    BankName = r.Field<string>("BankName"),
                    Status = r.Field<string>("Status"),
                    Cardno = r.Field<string>("CardNo"),
                    LeaveDate = r.Field<DateTime?>("LeftDate"),
                    Subdept = r.Field<string>("SubDepartment"),
                    LastPresent = r.Field<DateTime?>("LastPresent")
                }).ToList<Employees>();
            }
            return Result;
        }

        public IEnumerable<Employees> GetEmployeeListBetweenDate(string companyName, DateTime FromDate, DateTime UptoDate, int Choice)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = Data.AddParameter("@Ezn", companyName, SqlDbType.NVarChar, 30);
            param[1] = Data.AddParameter("@fdt", FromDate, SqlDbType.SmallDateTime, 30);
            param[2] = Data.AddParameter("@ToDt", UptoDate, SqlDbType.SmallDateTime, 5);
            param[3] = Data.AddParameter("@Choice", Choice, SqlDbType.Int, 5);
            DataTable Dtbl = Data.ExecuteDbProcedure("[Get_EmpList]", param);
            var Result = new List<Employees>();
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                Result = Dtbl.AsEnumerable().Select(r => new Employees
                {
                    EmpCode = r.Field<string>("EmpCode"),
                    EmpName = r.Field<string>("EmpName")
                }).ToList<Employees>();
            }
            return Result;
        }

        public IEnumerable<Employees> GetEmployeeListByCategory(string companyName, string category, string dept)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = Data.AddParameter("@Ezn", companyName, SqlDbType.NVarChar, 50);
            param[1] = Data.AddParameter("@Ctg", category, SqlDbType.NVarChar, 25);
            param[2] = Data.AddParameter("@Dept", dept, SqlDbType.NVarChar, 30);
            DataTable Dtbl = Data.ExecuteDbProcedure("[Get_EmpListByCategory]", param);
            var Result = new List<Employees>();
            if (Dtbl != null && Dtbl.Rows.Count > 0)
            {
                Result = Dtbl.AsEnumerable().Select(r => new Employees
                {
                    EmpCode = r.Field<string>("EmpCode"),
                    EmpName = r.Field<string>("EmpName"),
                }).ToList<Employees>();
            }
            return Result;
        }
    }

    public class UserManageActions : IUserManage
    {
        public int UpdatePassword(userInfo usr)
        {
            int flg = 0;
            SqlParameter[] sp = new SqlParameter[2];
            sp[0] = Data.AddParameter("@Username", usr?.username ?? "", SqlDbType.NVarChar, 50);
            sp[1] = Data.AddParameter("@Password", usr?.password ?? "", SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("Set_ChangePassword", sp);
            UserRole userRole = new UserRole();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                DataRow row = dtbl.Rows[0];
                flg = row["VerifyCode"] != DBNull.Value ? Convert.ToInt32(row["VerifyCode"]) : 0;
            }

            return flg;
        }

        public UserRole verifyUser(userInfo userinfo)
        {
            int flg = 0;
            SqlParameter[] sp = new SqlParameter[2];
            sp[0] = Data.AddParameter("@Uid", userinfo?.username ?? "", SqlDbType.NVarChar, 50);
            sp[1] = Data.AddParameter("@Password", userinfo?.password ?? "", SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("Get_verifyUser", sp);
            UserRole userRole = new UserRole();
            if (dtbl.Rows.Count > 0)
            {
                DataRow row = dtbl.Rows[0];

                userRole.verifyCode = row["VerifyCode"] != DBNull.Value ? Convert.ToInt32(row["VerifyCode"]) : 0;
                userRole.RoleID = row.Table.Columns.Contains("RoleID") && row["RoleID"] != DBNull.Value ? Convert.ToInt32(row["RoleID"]) : 0;
                userRole.UserID = row.Table.Columns.Contains("userID") && row["userID"] != DBNull.Value ? Convert.ToInt32(row["userID"]) : (row.Table.Columns.Contains("UserID") && row["UserID"] != DBNull.Value ? Convert.ToInt32(row["UserID"]) : 0);
            }

            return userRole;
        }

        public LoginResponseDto verifyUser(LoginRequestDto usr)
        {
            return MaxpayServices.VerifyUser(usr);
        }

        public int UpdatePassword(ChangePasswordModel usr)
        {
            bool success = MaxpayServices.ChangePassword(usr);
            return success ? 1 : 0;
        }
    }

    public class AttendanceReportActions : IAttendanceReport
    {
        public List<CategoryAttendance> TodayCategoryWiseHeadCount()
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = Data.AddParameter("@Fdt", null, SqlDbType.SmallDateTime, 10);
            DataTable dtbl = Data.ExecuteDbProcedure("sp_CategoryWiseManpowerCurrent", param);
            List<CategoryAttendance> result = new List<CategoryAttendance>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new CategoryAttendance
                    {
                        Regular = row.Field<double>(0),
                        FOT = row.Field<double>(1),
                        TOA = row.Field<double>(2),
                        RollReg = row.Field<double>(3),
                        RollFot = row.Field<double>(4),
                        RollToa = row.Field<double>(5),
                    }).ToList<CategoryAttendance>();
            }
            return result;
        }

        public List<DeptWiseCategoryWiseAttendance> DeptCategoryWiseHeadCount(DateTime forDate, string userName)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = Data.AddParameter("@fdt", forDate, SqlDbType.SmallDateTime, 10);
            param[1] = Data.AddParameter("@uid", userName, SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("sp_CategoryDeptWiseManpowerCurrent", param);

            List<DeptWiseCategoryWiseAttendance> result = new List<DeptWiseCategoryWiseAttendance>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new DeptWiseCategoryWiseAttendance
                    {
                        Dept = row.Field<string>(0),
                        Regular = row.Field<double>(1),
                        FOT = row.Field<double>(2),
                        TOA = row.Field<double>(3),
                        Total = row.Field<double>(4)
                    }).ToList<DeptWiseCategoryWiseAttendance>();
            }
            return result;
        }

        public List<ShiftWiseAttendance> GetShiftWiseHeadCount(DateTime ForDate, string Etype, string userName)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = Data.AddParameter("@Fdt", ForDate, SqlDbType.SmallDateTime, 10);
            param[1] = Data.AddParameter("@Etype", Etype, SqlDbType.NVarChar, 10);
            param[2] = Data.AddParameter("@uid", userName, SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("Sp_DailyShiftAttendance", param);
            Console.WriteLine(userName);
            List<ShiftWiseAttendance> result = new List<ShiftWiseAttendance>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new ShiftWiseAttendance
                    {
                        Dept = row.Field<string>(0),
                        Ashift = row.Field<double>(1),
                        Gshift = row.Field<double>(2),
                        Bshift = row.Field<double>(3),
                        Cshift = row.Field<double>(4),
                        Total = row.Field<double>(5)
                    }).ToList<ShiftWiseAttendance>();
            }
            return result;
        }

        private static double GetDoubleValue(DataRow row, string colName, int colIndex)
        {
            object? val = null;
            if (row.Table.Columns.Contains(colName))
            {
                val = row[colName];
            }
            else if (colIndex < row.Table.Columns.Count)
            {
                val = row[colIndex];
            }

            if (val == null || val == DBNull.Value) return 0.0;
            if (double.TryParse(val.ToString(), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double res))
            {
                return res;
            }
            try
            {
                return Convert.ToDouble(val);
            }
            catch
            {
                return 0.0;
            }
        }

        public List<DeptwiseApiManpower> GetDeptwiseApi(DateTime ForDate)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = Data.AddParameter("@Fdt", ForDate, SqlDbType.SmallDateTime, 10);

            DataTable dtbl = Data.ExecuteDbProcedure("sp_DeptWiseAPIManpower", param);
            List<DeptwiseApiManpower> result = new List<DeptwiseApiManpower>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new DeptwiseApiManpower
                    {
                        Dept = row[0]?.ToString() ?? "",
                        regular = GetDoubleValue(row, "Regular", 1),
                        fot = GetDoubleValue(row, "FOT", 2),
                        toa = GetDoubleValue(row, "TOA", 3),
                        Total = GetDoubleValue(row, "Total", 4),
                        regularApi = GetDoubleValue(row, "RegApi", 5),
                        fotApi = GetDoubleValue(row, "FotApi", 6),
                        toaApi = GetDoubleValue(row, "ToaApi", 7),
                        totalApi = GetDoubleValue(row, "TotalApi", 8),
                        absreg = GetDoubleValue(row, "absreg", 9),
                        absfot = GetDoubleValue(row, "absfot", 10),
                        absNaps = GetDoubleValue(row, "absNaps", 11)
                    }).ToList<DeptwiseApiManpower>();
            }
            return result;
        }

        public List<DeptwiseApiManpower> GetPeriodicApi(DateTime ForDate, DateTime UptoDate, string UserName)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = Data.AddParameter("@Fdt", ForDate, SqlDbType.SmallDateTime, 10);
            param[1] = Data.AddParameter("@Tdt", UptoDate, SqlDbType.SmallDateTime, 10);
            param[2] = Data.AddParameter("@uid", UserName, SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("sp_PerodicAPIManpower", param);
            List<DeptwiseApiManpower> result = new List<DeptwiseApiManpower>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new DeptwiseApiManpower
                    {
                        Dept = row[0]?.ToString() ?? "",
                        regular = GetDoubleValue(row, "Regular", 1),
                        fot = GetDoubleValue(row, "FOT", 2),
                        toa = GetDoubleValue(row, "TOA", 3),
                        Total = GetDoubleValue(row, "Total", 4),
                        regularApi = GetDoubleValue(row, "RegApi", 5),
                        fotApi = GetDoubleValue(row, "FotApi", 6),
                        toaApi = GetDoubleValue(row, "ToaApi", 7),
                        totalApi = GetDoubleValue(row, "TotalApi", 8),
                        absreg = GetDoubleValue(row, "absreg", 9),
                        absfot = GetDoubleValue(row, "absfot", 10),
                        absNaps = GetDoubleValue(row, "absNaps", 11)
                    }).ToList<DeptwiseApiManpower>();
            }
            return result;
        }

        public List<EmployeeAttendance> GetAttendanceForVerification(DateTime forDate, string Department, string shift, string userName)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = Data.AddParameter("@Fdt", forDate, SqlDbType.SmallDateTime, 10);
            param[1] = Data.AddParameter("@Dept", Department, SqlDbType.NVarChar, 30);
            param[2] = Data.AddParameter("@shift", shift, SqlDbType.NVarChar, 10);
            param[3] = Data.AddParameter("@userName", userName, SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("Sp_AttendanceVerification", param);
            List<EmployeeAttendance> result = new List<EmployeeAttendance>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new EmployeeAttendance
                    {
                        EmpCode = row.Field<string>(0),
                        EmpName = row.Field<string>(1),
                        Department = row.Field<string>(2),
                        Category = row.Field<string>(3),
                        Shift = row.Field<string>(4),
                        InTime = row.Field<string>(5),
                        OutTime = row.Field<string>(6),
                        WorkHrs = row.Field<string>(7),
                        attStatus = row.Field<string>(8),
                        ApiHrs = row.Field<string>(9)
                    }).ToList<EmployeeAttendance>();
            }
            return result;
        }

        public List<EmployeeAttendance> GetDailyArrival(DateTime forDate, string ezone, string username)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = Data.AddParameter("@Fdt", forDate, SqlDbType.SmallDateTime, 10);
            param[1] = Data.AddParameter("@Ezone", ezone, SqlDbType.NVarChar, 30);
            param[2] = Data.AddParameter("@Uid", username, SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("[get_DailyArrival]", param);
            List<EmployeeAttendance> result = new List<EmployeeAttendance>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new EmployeeAttendance
                    {
                        EmpCode = row.Field<string>(0),
                        Ezone = row.Field<string>(1),
                        EmpName = row.Field<string>(2),
                        Department = row.Field<string>(3),
                        Category = row.Field<string>(4),
                        InTime = row.Field<string>(5)
                    }).ToList<EmployeeAttendance>();
            }
            return result;
        }

        public DataTable DeptWisePlanVsActual(DateTime forDate, string UserName)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = Data.AddParameter("@Fdt", forDate, SqlDbType.SmallDateTime, 10);
            param[1] = Data.AddParameter("@Uid", UserName, SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("[Sp_DateWisePlanVsActual]", param);
            return dtbl;
        }

        public DataTable DailyDeptAbsenteeism(DateTime forDate)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = Data.AddParameter("@Fdt", forDate, SqlDbType.SmallDateTime, 10);
            DataTable dtbl = Data.ExecuteDbProcedure("[Sp_DateWiseDailyAbsenteeism]", param);
            return dtbl;
        }

        public IEnumerable<musterRoll> MusterRoll(DateTime fromDate, DateTime ToDate, string Ezone)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = Data.AddParameter("@Stdate", fromDate, SqlDbType.SmallDateTime, 10);
            param[1] = Data.AddParameter("@EDate", ToDate, SqlDbType.SmallDateTime, 10);
            param[2] = Data.AddParameter("@Ezone", Ezone, SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("[Get_MusterRoll]", param);
            List<musterRoll> result = new List<musterRoll>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new musterRoll
                    {
                        EmpCode = row.Field<string>(0),
                        Name = row.Field<string>(1),
                        Dept = row.Field<string>(2),
                        Category = row.Field<string>(3),
                        dt1 = row.Field<string>(4),
                        dt2 = row.Field<string>(5),
                        dt3 = row.Field<string>(6),
                        dt4 = row.Field<string>(7),
                        dt5 = row.Field<string>(8),
                        dt6 = row.Field<string>(9),
                        dt7 = row.Field<string>(10),
                        dt8 = row.Field<string>(11),
                        dt9 = row.Field<string>(12),
                        dt10 = row.Field<string>(13),
                        dt11 = row.Field<string>(14),
                    }).ToList<musterRoll>();
            }
            return result;
        }

        public List<DeptwiseApiManpower> GetDeptwiseManpowerDashboard(DateTime? ForDate = null)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = Data.AddParameter("@Fdt", ForDate, SqlDbType.SmallDateTime, 10);

            DataTable dtbl = Data.ExecuteDbProcedure("[Get_Contractor_ALL_DeptWiseTodayManpower]", param);
            List<DeptwiseApiManpower> result = new List<DeptwiseApiManpower>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new DeptwiseApiManpower
                    {
                        Dept = row.Field<string>(0),
                        regular = row.Field<double>(1),
                        fot = row.Field<double>(2),
                        toa = row.Field<double>(3),
                        Total = row.Field<double>(4),
                        regularApi = row.Field<double>(5),
                        fotApi = row.Field<double>(6),
                        toaApi = row.Field<double>(7),
                        totalApi = row.Field<double>(8)
                    }).ToList<DeptwiseApiManpower>();
            }
            return result;
        }

        public List<DeptwiseApiManpower> GetDeptwiseManpowerDashboardForDept(string? username = null, DateTime? ForDate = null)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = Data.AddParameter("@Fdt", ForDate, SqlDbType.SmallDateTime, 10);
            param[1] = Data.AddParameter("@Uid", username, SqlDbType.NVarChar, 50);
            DataTable dtbl = Data.ExecuteDbProcedure("[Get_Contractor_ALL_DeptWiseTodayManpowerForDept]", param);
            List<DeptwiseApiManpower> result = new List<DeptwiseApiManpower>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new DeptwiseApiManpower
                    {
                        Dept = row.Field<string>(0),
                        regular = row.Field<double>(1),
                        fot = row.Field<double>(2),
                        toa = row.Field<double>(3),
                        Total = row.Field<double>(4),
                        regularApi = row.Field<double>(5),
                        fotApi = row.Field<double>(6),
                        toaApi = row.Field<double>(7),
                        totalApi = row.Field<double>(8)
                    }).ToList<DeptwiseApiManpower>();
            }
            return result;
        }

        public List<EmployeeAttendance> GetIndividualAttendance(string EmpCode, DateTime forDate, DateTime ToDt)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = Data.AddParameter("@EmpCode", EmpCode, SqlDbType.NVarChar, 10);
            param[1] = Data.AddParameter("@FromDt", forDate, SqlDbType.SmallDateTime, 10);
            param[2] = Data.AddParameter("@ToDt", ToDt, SqlDbType.SmallDateTime, 10);
            DataTable dtbl = Data.ExecuteDbProcedure("Get_IndividualAttendance", param);
            List<EmployeeAttendance> result = new List<EmployeeAttendance>();
            if (dtbl != null && dtbl.Rows.Count > 0)
            {
                result = dtbl.AsEnumerable()
                    .Select(row => new EmployeeAttendance
                    {
                        EmpCode = row.Field<string>(0),
                        EmpName = row.Field<string>(1),
                        Department = row.Field<string>(2),
                        Category = row.Field<string>(3),
                        attDate = row.Field<DateTime>(4),
                        Shift = row.Field<string>(5),
                        InTime = row.Field<string>(6),
                        OutTime = row.Field<string>(7),
                        attStatus = row.Field<string>(8),
                        WorkHrs = row.Field<string>(9),
                        ApiHrs = row.Field<string>(10)
                    }).ToList<EmployeeAttendance>();
            }
            return result;
        }
    }

    public class ContractorActions : IContractor
    {
        public IEnumerable<ContractorDeptManpower> DeptContractorManpower(string username, DateTime? dts = null)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = Data.AddParameter("@Username", username, SqlDbType.NVarChar, 50);
                param[1] = Data.AddParameter("@fdt", dts, SqlDbType.SmallDateTime, 10);
                DataTable Dtbl = Data.ExecuteDbProcedure("[Get_Contractor_DeptWiseTodayManpower]", param);
                var Result = new List<ContractorDeptManpower>();
                if (Dtbl != null && Dtbl.Rows.Count > 0)
                {
                    Result = Dtbl.AsEnumerable().Select(r => new ContractorDeptManpower
                    {
                        Dept = r.Field<string>("Dept") ?? "",
                        Regular = r.Field<double>("Regular"),
                        Fot = r.Field<double>("Fot"),
                        Toa = r.Field<double>("Toa"),
                        TotalManpower = r.Field<double>("Total"),
                        ApiReg = r.Field<double>("RegApi"),
                        ApiFot = r.Field<double>("FotApi"),
                        ApiToa = r.Field<double>("ToaApi"),
                        ApiTotal = r.Field<double>("TotalApi"),
                    }).ToList<ContractorDeptManpower>();
                }
                return Result;
            }
            catch { return new List<ContractorDeptManpower>(); }
        }

        public IEnumerable<ListItem> GetContractorList(string username)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[1];
                param[0] = Data.AddParameter("@Username", username, SqlDbType.NVarChar, 50);
                DataTable Dtbl = Data.ExecuteDbProcedure("[sp_Getzone]", param);
                if (Dtbl == null || Dtbl.Rows.Count == 0)
                {
                    Dtbl = Data.ExecuteDbQuery("SELECT DISTINCT CompID, CompName FROM Contractors WHERE CompName IS NOT NULL AND CompName <> '' ORDER BY CompName");
                }
                if (Dtbl == null || Dtbl.Rows.Count == 0)
                {
                    Dtbl = Data.ExecuteDbQuery("SELECT DISTINCT 1 AS CompID, Ezone AS CompName FROM EmployeeMaster WHERE Ezone IS NOT NULL AND Ezone <> '' ORDER BY Ezone");
                }

                var Result = new List<ListItem>();
                if (Dtbl != null && Dtbl.Rows.Count > 0)
                {
                    Result = Dtbl.AsEnumerable().Select(r => new ListItem
                    {
                        id = r.Table.Columns.Contains("CompID") && r["CompID"] != DBNull.Value ? Convert.ToInt32(r["CompID"]) : 1,
                        ItemName = r.Table.Columns.Contains("CompName") ? Convert.ToString(r["CompName"]) ?? "" : "",
                    }).Where(x => !string.IsNullOrWhiteSpace(x.ItemName)).ToList<ListItem>();
                }
                return Result;
            }
            catch { return new List<ListItem>(); }
        }

        public IEnumerable<ContractorOnRoll> GetContractorStrength(string username)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[1];
                param[0] = Data.AddParameter("@Username", username, SqlDbType.NVarChar, 50);
                DataTable Dtbl = Data.ExecuteDbProcedure("[Get_ContractorOnRoll]", param);
                var Result = new List<ContractorOnRoll>();
                if (Dtbl != null && Dtbl.Rows.Count > 0)
                {
                    Result = Dtbl.AsEnumerable().Select(r => new ContractorOnRoll
                    {
                        Category = r.Field<string>("ctg") ?? "",
                        LastMonth = r.Field<int>("LAstMonth"),
                        NewJoin = r.Field<int>("NewJoin"),
                        leave = r.Field<int>("Leave"),
                        Balance = r.Field<int>("Balance")
                    }).ToList<ContractorOnRoll>();
                }
                return Result;
            }
            catch { return new List<ContractorOnRoll>(); }
        }

        public int RegisterContractor(Contractors contractors)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ContractorTodayManpower> TodayALLContractorManpower(DateTime? dt = null)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[1];
                param[0] = Data.AddParameter("@Fdt", dt, SqlDbType.SmallDateTime, 50);
                DataTable Dtbl = Data.ExecuteDbProcedure("[Get_ContractorWisePresent]", param);
                var Result = new List<ContractorTodayManpower>();
                if (Dtbl != null && Dtbl.Rows.Count > 0)
                {
                    Result = Dtbl.AsEnumerable().Select(r => new ContractorTodayManpower
                    {
                        ezone = r.Field<string>("ezone") ?? "",
                        Regular = r.Field<double>("reg"),
                        FOT = r.Field<double>("Fot"),
                        TOA = r.Field<double>("toa"),
                        total = r.Field<double>("total")
                    }).ToList<ContractorTodayManpower>();
                }
                return Result;
            }
            catch { return new List<ContractorTodayManpower>(); }
        }

        public IEnumerable<ContractorTodayManpower> TodayALLContractorManpowerForDept(string UserName, DateTime? dt = null)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = Data.AddParameter("@Fdt", dt, SqlDbType.SmallDateTime, 50);
                param[1] = Data.AddParameter("@Uid", UserName, SqlDbType.NVarChar, 50);
                DataTable Dtbl = Data.ExecuteDbProcedure("[Get_ContractorWisePresentForDept]", param);
                var Result = new List<ContractorTodayManpower>();
                if (Dtbl != null && Dtbl.Rows.Count > 0)
                {
                    Result = Dtbl.AsEnumerable().Select(r => new ContractorTodayManpower
                    {
                        ezone = r.Field<string>("ezone") ?? "",
                        Regular = r.Field<double>("reg"),
                        FOT = r.Field<double>("Fot"),
                        TOA = r.Field<double>("toa"),
                        total = r.Field<double>("total")
                    }).ToList<ContractorTodayManpower>();
                }
                return Result;
            }
            catch { return new List<ContractorTodayManpower>(); }
        }

        public IEnumerable<ContractorTodayManpower> TodayContractorManpower(string username, DateTime? dt = null)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = Data.AddParameter("@Username", username, SqlDbType.NVarChar, 50);
                param[1] = Data.AddParameter("@fdt", dt, SqlDbType.SmallDateTime, 10);
                DataTable Dtbl = Data.ExecuteDbProcedure("[Get_ContractorTodayManpower]", param);
                var Result = new List<ContractorTodayManpower>();
                if (Dtbl != null && Dtbl.Rows.Count > 0)
                {
                    Result = Dtbl.AsEnumerable().Select(r => new ContractorTodayManpower
                    {
                        ezone = r.Field<string>("ezone") ?? "",
                        Regular = r.Field<double>("reg"),
                        FOT = r.Field<double>("Fot"),
                        TOA = r.Field<double>("toa"),
                        total = r.Field<double>("total")
                    }).ToList<ContractorTodayManpower>();
                }
                return Result;
            }
            catch { return new List<ContractorTodayManpower>(); }
        }
    }

    public class OrgStructureActions : IOrgStructure
    {
        public IEnumerable<Department> GetDepartmentList()
        {
            try
            {
                string sql = "SELECT Dept, MainDept as MainDepartment, DeptCode as DeptID From Department Order By Dept";
                DataTable dtbl = DataLayer.ExecuteDbQuery(sql);
                var deptList = new List<Department>();
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    foreach (DataRow r in dtbl.Rows)
                    {
                        deptList.Add(new Department
                        {
                            Dept = r.Table.Columns.Contains("Dept") && r["Dept"] != DBNull.Value ? Convert.ToString(r["Dept"]) : "",
                            MainDepartment = r.Table.Columns.Contains("MainDepartment") && r["MainDepartment"] != DBNull.Value ? Convert.ToString(r["MainDepartment"]) : "",
                            DeptID = r.Table.Columns.Contains("DeptID") && r["DeptID"] != DBNull.Value ? Convert.ToInt32(r["DeptID"]) : 0
                        });
                    }
                }
                return deptList;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<Department>();
            }
        }

        public IEnumerable<Location> GetLocationList()
        {
            try
            {
                string sql = "SELECT DISTINCT Loc as loc FROM EmployeeMaster Where Loc is not Null";
                DataTable dtbl = DataLayer.ExecuteDbQuery(sql);
                var list = new List<Location>();
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    foreach (DataRow r in dtbl.Rows)
                    {
                        list.Add(new Location
                        {
                            loc = r.Table.Columns.Contains("loc") && r["loc"] != DBNull.Value ? Convert.ToString(r["loc"]) : ""
                        });
                    }
                }
                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new List<Location>();
            }
        }

        public IEnumerable<Designation> GetDesignationList()
        {
            try
            {
                string sql = "SELECT DISTINCT Desig as desig FROM EmployeeMaster Where desig is not Null";
                DataTable dtbl = DataLayer.ExecuteDbQuery(sql);
                var list = new List<Designation>();
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    foreach (DataRow r in dtbl.Rows)
                    {
                        list.Add(new Designation
                        {
                            Desig = r.Table.Columns.Contains("desig") && r["desig"] != DBNull.Value ? Convert.ToString(r["desig"]) : ""
                        });
                    }
                }
                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new List<Designation>();
            }
        }

        public IEnumerable<Master_Bank> GetBankList()
        {
            try
            {
                string sql = "SELECT id, Bname From Master_Bank Order By Bname";
                DataTable dtbl = DataLayer.ExecuteDbQuery(sql);
                var list = new List<Master_Bank>();
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    foreach (DataRow r in dtbl.Rows)
                    {
                        list.Add(new Master_Bank
                        {
                            id = r.Table.Columns.Contains("id") && r["id"] != DBNull.Value ? Convert.ToInt32(r["id"]) : 0,
                            BName = r.Table.Columns.Contains("Bname") && r["Bname"] != DBNull.Value ? Convert.ToString(r["Bname"]) : (r.Table.Columns.Contains("BName") && r["BName"] != DBNull.Value ? Convert.ToString(r["BName"]) : "")
                        });
                    }
                }
                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<Master_Bank>();
            }
        }
    }

    public class MastersImportActions : IMastersImport
    {
        public void ImportEmployeeFromExcel(List<Employees> employees) { }
        public void ImportEmployeeFromExcel(List<EmployeeDto> employees) { }
    }

    public class TempEmpActions : ITempEmp
    {
        public string SaveTempEmployee(TempEmployee emp)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[12];
                param[0] = DataLayer.AddParameter("@TempCd", emp?.TempCode ?? "", SqlDbType.NVarChar, 30);
                param[1] = DataLayer.AddParameter("@Ezone", emp?.Ezn ?? "", SqlDbType.NVarChar, 50);
                param[2] = DataLayer.AddParameter("@Ctg", emp?.Category ?? "", SqlDbType.NVarChar, 30);
                param[3] = DataLayer.AddParameter("@Etype", emp?.EmpType ?? "", SqlDbType.NVarChar, 30);
                param[4] = DataLayer.AddParameter("@Name", emp?.EmpName ?? "", SqlDbType.NVarChar, 50);
                param[5] = DataLayer.AddParameter("@FName", emp?.FatherName ?? "", SqlDbType.NVarChar, 50);
                param[6] = DataLayer.AddParameter("@Dob", emp?.Dob ?? DateTime.Now.AddYears(-20), SqlDbType.SmallDateTime, 10);
                param[7] = DataLayer.AddParameter("@Doj", emp?.Doj ?? DateTime.Now, SqlDbType.SmallDateTime, 10);
                param[8] = DataLayer.AddParameter("@ContactNo", emp?.contact ?? "", SqlDbType.NVarChar, 20);
                param[9] = DataLayer.AddParameter("@Ref", emp?.refr ?? "", SqlDbType.NVarChar, 50);
                param[10] = DataLayer.AddParameter("@Aadhar", emp?.Aadhar ?? "", SqlDbType.NVarChar, 20);
                param[11] = DataLayer.AddParameter("@Pan", emp?.Pan ?? "", SqlDbType.NVarChar, 20);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("Save_TempEmployee", param);
                if (dtbl != null && dtbl.Rows.Count > 0) return dtbl.Rows[0][0]?.ToString() ?? "1";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SaveTempEmployee Error: {ex.Message}");
            }
            return "1";
        }

        public string SaveTempEmpAddress(TempAddress tempAddress)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[6];
                param[0] = DataLayer.AddParameter("@EmpCd", tempAddress?.EmpCode ?? "", SqlDbType.NVarChar, 30);
                param[1] = DataLayer.AddParameter("@Cr_Village", tempAddress?.C_Vill ?? "", SqlDbType.NVarChar, 50);
                param[2] = DataLayer.AddParameter("@Cr_Post", tempAddress?.PO ?? "", SqlDbType.NVarChar, 50);
                param[3] = DataLayer.AddParameter("@Cr_Dist", tempAddress?.Dist ?? "", SqlDbType.NVarChar, 50);
                param[4] = DataLayer.AddParameter("@Cr_State", tempAddress?.State ?? "", SqlDbType.NVarChar, 50);
                param[5] = DataLayer.AddParameter("@Cr_Pin", tempAddress?.PinCode ?? "", SqlDbType.NVarChar, 10);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("Save_TempEmpAddress", param);
                if (dtbl != null && dtbl.Rows.Count > 0) return dtbl.Rows[0][0]?.ToString() ?? "1";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SaveTempEmpAddress Error: {ex.Message}");
            }
            return "1";
        }

        public IEnumerable<TempEmployee> SearchTempEmployeeBytCode(string tmpCode)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[1];
                param[0] = DataLayer.AddParameter("@EmpCd", tmpCode ?? "", SqlDbType.NVarChar, 10);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("Search_tEmpByTempCode", param);
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    var emp = dtbl.AsEnumerable().Select(x => new TempEmployee
                    {
                        TempCode = x.Field<string>("TempCode") ?? "",
                        Ezn = x.Table.Columns.Contains("Ezone") ? x.Field<string>("Ezone") : "",
                        EmpType = x.Table.Columns.Contains("Etype") ? x.Field<string>("Etype") : "",
                        EmpName = x.Table.Columns.Contains("EmpName") ? x.Field<string>("EmpName") : "",
                        FatherName = x.Table.Columns.Contains("FName") ? x.Field<string>("FName") : "",
                        dept = x.Table.Columns.Contains("Dept") ? x.Field<string>("Dept") : "",
                        contact = x.Table.Columns.Contains("Contact") ? x.Field<string>("Contact") : "",
                        refr = x.Table.Columns.Contains("ref") ? x.Field<string>("ref") : "",
                        Aadhar = x.Table.Columns.Contains("Aadhar") ? x.Field<string>("Aadhar") : "",
                        Pan = x.Table.Columns.Contains("Pan") ? x.Field<string>("Pan") : ""
                    }).ToList();
                    return emp;
                }
            }
            catch { }
            return new List<TempEmployee>();
        }

        public IEnumerable<TempEmployee> getTempEmployeeList(string ezn)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = DataLayer.AddParameter("@Ezn", ezn ?? "", SqlDbType.NVarChar, 30);
                param[1] = DataLayer.AddParameter("@Choice", 3, SqlDbType.Int, 5);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("Get_EmpList", param);
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    return dtbl.AsEnumerable().Select(r => new TempEmployee
                    {
                        TempCode = r.Field<string>("TempCode") ?? "",
                        EmpName = r.Field<string>("EmpName") ?? ""
                    }).ToList();
                }
            }
            catch { }
            return new List<TempEmployee>();
        }

        public IEnumerable<TempEmployee> TempEmpListForPromote(DateTime dt)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = DataLayer.AddParameter("@Doj", dt, SqlDbType.SmallDateTime, 10);
                param[1] = DataLayer.AddParameter("@choice", "1", SqlDbType.NVarChar, 3);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("get_DojoEmployee", param);
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    return dtbl.AsEnumerable().Select(r => new TempEmployee
                    {
                        TempCode = r.Field<string>("empCode") ?? "",
                        EmpName = r.Field<string>("EmpName") ?? "",
                        FatherName = r.Table.Columns.Contains("FName") ? r.Field<string>("FName") : "",
                        Ezn = r.Table.Columns.Contains("Ezone") ? r.Field<string>("Ezone") : ""
                    }).ToList();
                }
            }
            catch { }
            return new List<TempEmployee>();
        }

        public IEnumerable<DojoResult> getDojoResult(DateTime dt)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = DataLayer.AddParameter("@Doj", dt, SqlDbType.SmallDateTime, 10);
                param[1] = DataLayer.AddParameter("@choice", "5", SqlDbType.NVarChar, 3);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("get_DojoEmployee", param);
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    return dtbl.AsEnumerable().Select(r => new DojoResult
                    {
                        empCode = r.Field<string>("empCode") ?? "",
                        EmpName = r.Field<string>("EmpName") ?? "",
                        FatherName = r.Table.Columns.Contains("FName") ? r.Field<string>("FName") : "",
                        Ezn = r.Table.Columns.Contains("Ezone") ? r.Field<string>("Ezone") : "",
                        sts = r.Table.Columns.Contains("result") ? r.Field<string>("result") : "",
                        marks = r.Table.Columns.Contains("mark") && r["mark"] != DBNull.Value ? Convert.ToDouble(r["mark"]) : 0
                    }).ToList();
                }
            }
            catch { }
            return new List<DojoResult>();
        }

        public IEnumerable<DojoResult> getDojoFullList(DateTime dt)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = DataLayer.AddParameter("@Doj", dt, SqlDbType.SmallDateTime, 10);
                param[1] = DataLayer.AddParameter("@choice", "7", SqlDbType.NVarChar, 3);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("get_DojoEmployee", param);
                if (dtbl != null && dtbl.Rows.Count > 0)
                {
                    return dtbl.AsEnumerable().Select(r => new DojoResult
                    {
                        empCode = r.Field<string>("empCode") ?? "",
                        EmpName = r.Field<string>("EmpName") ?? "",
                        FatherName = r.Table.Columns.Contains("FName") ? r.Field<string>("FName") : "",
                        Ezn = r.Table.Columns.Contains("Ezone") ? r.Field<string>("Ezone") : "",
                        sts = r.Table.Columns.Contains("result") ? r.Field<string>("result") : "",
                        marks = r.Table.Columns.Contains("mark") && r["mark"] != DBNull.Value ? Convert.ToDouble(r["mark"]) : 0,
                        Dept = r.Table.Columns.Contains("Department") ? r.Field<string>("Department") : ""
                    }).ToList();
                }
            }
            catch { }
            return new List<DojoResult>();
        }

        public int SaveTempEmpHandover(List<PromotionResultDTO> pdto, DateTime PassDate)
        {
            try
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("EmpCode", typeof(string));
                dt.Columns.Add("Result", typeof(string));
                dt.Columns.Add("Marks", typeof(double));

                if (pdto != null)
                {
                    foreach (var item in pdto)
                    {
                        dt.Rows.Add(item.EmpCode, item.Result, item.Marks);
                    }
                }

                SqlParameter[] param = new SqlParameter[3];
                param[0] = DataLayer.AddParameter("@PromotionResult", dt, SqlDbType.Structured, 10);
                param[1] = DataLayer.AddParameter("@passdt", PassDate, SqlDbType.DateTime, 10);
                param[2] = DataLayer.AddParameter("@USerid", "Admin", SqlDbType.NVarChar, 50);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("SavePromotionResult_Bulk", param);
                if (dtbl != null) return dtbl.Rows.Count;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SaveTempEmpHandover Error: {ex.Message}");
            }
            return pdto?.Count ?? 0;
        }

        public DataTable getDojoEmployee(DateTime dt)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[3];
                param[0] = DataLayer.AddParameter("@Doj", dt, SqlDbType.SmallDateTime, 10);
                param[1] = DataLayer.AddParameter("@TmpCode", DBNull.Value, SqlDbType.NVarChar, 10);
                param[2] = DataLayer.AddParameter("@Choice", "8", SqlDbType.NVarChar, 3);
                DataTable dtbl = DataLayer.ExecuteDbProcedure("get_DojoEmployee", param);
                if (dtbl != null) return dtbl;
            }
            catch { }
            return new DataTable();
        }

        public byte[] GenerateDojoCretificate(DataTable model) => Array.Empty<byte>();
    }
}
