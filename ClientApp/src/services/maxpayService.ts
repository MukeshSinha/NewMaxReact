import axios from 'axios';
import {
  ManpowerSummary,
  ContractorManpower,
  DeptManpower,
  Employee,
  AttendanceRecord,
  LeaveBalanceItem,
  LeaveRequestData,
  RecentAttendanceItem,
  WeekoffTransferRecord,
  ForgetPunchRecord,
  ShiftRotationRecord,
  ShiftRosterGridRow,
  EmployeeShiftDetail,
  AttendanceVerifyRecord
} from '../types/maxpay.types';

const API_BASE = '/api';

export const maxpayService = {
  // Existing Dashboard Services
  getTodayAttendance: async (date?: string): Promise<ManpowerSummary[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/TodayAttendance`, { params: { dt: date } });
      if (Array.isArray(res.data)) return res.data;
      if (res.data && typeof res.data === 'object') return [res.data];
      return [];
    } catch {
      return [];
    }
  },

  getContractorTodayManpower: async (date?: string): Promise<ContractorManpower[]> => {
    try {
      const res = await axios.get(`${API_BASE}/ContractorMaster/GetALLContractorTodayManpower`, { params: { dt: date } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getDeptwiseManpowerALL: async (date?: string): Promise<DeptManpower[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/DeptwiseManpowerALL`, { params: { dt: date } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getEmployees: async (): Promise<Employee[]> => {
    try {
      const res = await axios.get(`${API_BASE}/EmployeesMaster/GetEmployeeList`);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getAttendanceRecords: async (date?: string, dept?: string, shift?: string): Promise<AttendanceRecord[]> => {
    try {
      const res = await axios.get(`${API_BASE}/DeptVerification/GetPresentList`, {
        params: { Fdt: date || new Date().toISOString().split('T')[0], Dept: dept || '', sft: shift || '' }
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getContractorTodayManpowerForDept: async (date?: string): Promise<ContractorManpower[]> => {
    try {
      const res = await axios.get(`${API_BASE}/ContractorMaster/GetALLContractorTodayManpowerForDept`, { params: { dt: date } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getDeptwiseManpowerALLForDept: async (date?: string): Promise<DeptManpower[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/DeptwiseManpowerALLForDept`, { params: { dt: date } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getContractorStrength: async (): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/ContractorMaster/GetContractorStrength`);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getContractorDeptManpower: async (date?: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/ContractorMaster/ContractorDeptManpoer`, { params: { dt: date } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  // ----------------------------------------------------
  // TIME OFFICE SERVICES
  // ----------------------------------------------------

  // Master Dropdown helpers
  getContractorList: async (): Promise<{ id: number; itemName: string }[]> => {
    try {
      const res = await axios.get(`${API_BASE}/ContractorMaster/GetContractorList`);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getDepartmentsList: async (): Promise<string[]> => {
    try {
      let res = await axios.get(`${API_BASE}/Orgsetup/GetDepartmentList`);
      let list = Array.isArray(res.data) ? res.data : [];
      if (list.length === 0) {
        res = await axios.get(`${API_BASE}/DeptVerification/GetDepartmentList`);
        list = Array.isArray(res.data) ? res.data : [];
      }
      if (list.length === 0) {
        res = await axios.get('/OrganizationSetting/OrgSetup/GetDepartmentList');
        list = Array.isArray(res.data) ? res.data : [];
      }

      const deptNames: string[] = [];
      list.forEach((item: any) => {
        if (typeof item === 'string' && item.trim()) {
          const val = item.trim();
          if (!deptNames.includes(val)) deptNames.push(val);
        } else if (item && typeof item === 'object') {
          const name = item.dept || item.Dept || item.deptName || item.DeptName || item.name;
          if (name && typeof name === 'string' && name.trim()) {
            const val = name.trim();
            if (!deptNames.includes(val)) deptNames.push(val);
          }
        }
      });
      return deptNames.sort();
    } catch {
      return [];
    }
  },

  getShiftsList: async (): Promise<{ code: string; inTime: string; outTime: string; isNight: boolean }[]> => {
    try {
      const res = await axios.get(`${API_BASE}/Shift/GetShifts`);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  // 1. Attendance Process (Punch Process)
  getEmployeeListBetweenDate: async (
    companyName: string,
    fromDate: string,
    uptoDate: string,
    choice = 1
  ): Promise<{ empCode: string; empName: string }[]> => {
    try {
      const res = await axios.get(`${API_BASE}/EmployeesMaster/GetEmployeeListBetweenDate`, {
        params: { companyName, FromDate: fromDate, UptoDate: uptoDate, Choice: choice }
      });
      const data = Array.isArray(res.data) ? res.data : [];
      if (data.length > 0) {
        return data.map((item: any) => ({
          empCode: item.empCode || item.empcd || item.code || '',
          empName: item.empName || item.name || ''
        }));
      }
    } catch {
      // fallback
    }

    try {
      const res2 = await axios.get(`${API_BASE}/EmployeesMaster/GetEmployeeList`);
      const data2 = Array.isArray(res2.data) ? res2.data : [];
      return data2.map((item: any) => ({
        empCode: item.empCode || item.empcd || item.code || '',
        empName: item.empName || item.name || ''
      }));
    } catch {
      return [];
    }
  },

  processPunches: async (payload: { empCodes: string[]; fromDate: string; uptoDate: string; compCode?: number }) => {
    const body = {
      empcode: payload.empCodes,
      FromDt: payload.fromDate,
      UptoDt: payload.uptoDate,
      ProcessDate: payload.fromDate,
      ShiftCode: 'ALL'
    };
    const res = await axios.post(`${API_BASE}/AttendanceProcess/Punchprocessing`, body);
    return res.data;
  },

  // 2. Leave Posting
  getLeaveBalances: async (empCode: string): Promise<LeaveBalanceItem[]> => {
    try {
      const res = await axios.get(`${API_BASE}/EmployeeLeaves/GetBalances`, { params: { empCode } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  getEmployeeRecentAttendance: async (empCode: string): Promise<RecentAttendanceItem[]> => {
    try {
      const res = await axios.get(`${API_BASE}/EmployeeLeaves/GetRecentAttendance`, { params: { empCode } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  submitLeaveRequest: async (request: LeaveRequestData) => {
    const res = await axios.post(`${API_BASE}/EmployeeLeaves/ApplyLeave`, request);
    return res.data;
  },

  getPreviousLeaveRequests: async (empCode: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/EmployeeLeaves/GetPreviousRequests`, { params: { empCode } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  // 3. Weekoff Transfer
  getWeekoffTransfers: async (): Promise<WeekoffTransferRecord[]> => {
    try {
      const res = await axios.get(`${API_BASE}/TimeOffice/WeekoffTransfers`);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  submitWeekoffTransfer: async (data: Partial<WeekoffTransferRecord>) => {
    const res = await axios.post(`${API_BASE}/TimeOffice/WeekoffTransfer`, data);
    return res.data;
  },

  // 4. Forget Punch
  getForgetPunchRecords: async (): Promise<ForgetPunchRecord[]> => {
    try {
      const res = await axios.get(`${API_BASE}/TimeOffice/ForgetPunchList`);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  submitForgetPunch: async (data: Partial<ForgetPunchRecord>) => {
    const res = await axios.post(`${API_BASE}/TimeOffice/ForgetPunch`, data);
    return res.data;
  },

  // 5. Shift Rotation
  getShiftRotationRules: async (): Promise<ShiftRotationRecord[]> => {
    try {
      const res = await axios.get(`${API_BASE}/Shift/GetRotations`);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  saveShiftRotation: async (payload: ShiftRotationRecord | { employeeCodes: string[]; shiftSequence: string[]; effectiveDate: string }) => {
    const res = await axios.post(`${API_BASE}/Shift/SaveRotation`, payload);
    return res.data;
  },

  // 6. Shift Roaster
  getShiftRosterData: async (month: number, year: number, dept?: string): Promise<ShiftRosterGridRow[]> => {
    try {
      const res = await axios.get(`${API_BASE}/Shift/GetRoster`, { params: { month, year, dept } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  saveShiftRosterData: async (rosterData: ShiftRosterGridRow[]) => {
    const res = await axios.post(`${API_BASE}/Shift/SaveRoster`, rosterData);
    return res.data;
  },

  // 7. Employee Shift Details
  getEmployeeShiftDetails: async (empCode?: string): Promise<EmployeeShiftDetail[]> => {
    try {
      const res = await axios.get(`${API_BASE}/Shift/GetEmployeeShiftDetails`, { params: { empCode } });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  updateEmployeeShift: async (data: Partial<EmployeeShiftDetail>) => {
    const res = await axios.post(`${API_BASE}/Shift/UpdateEmployeeShift`, data);
    return res.data;
  },

  // 8. Import Shift Roster
  uploadShiftRosterExcel: async (rows: any[]) => {
    const res = await axios.post(`${API_BASE}/Shift/ImportShiftRoster`, rows);
    return res.data;
  },

  // 9. Attendance Verification
  getAttendanceVerificationList: async (date?: string, dept?: string, shift?: string): Promise<AttendanceVerifyRecord[]> => {
    try {
      const fDate = date || new Date().toISOString().split('T')[0];
      const res = await axios.get(`${API_BASE}/DeptVerification/GetPresentList`, {
        params: {
          Fdt: fDate,
          Dept: dept || 'ALL',
          sft: shift || 'ALL'
        }
      });
      const rawList = Array.isArray(res.data) ? res.data : [];
      return rawList.map((row: any, idx: number) => ({
        id: row.id || row.empCode || `verify_${idx}`,
        empCode: row.empCode || '',
        name: row.name || row.empName || '',
        department: row.department || row.dept || '',
        category: row.category || '',
        shift: row.shift || '',
        inTime: row.inTime || '',
        outTime: row.outTime || '',
        workHrs: row.workHrs || '',
        api: row.api || row.apiHrs || '',
        status: (row.status === 'Verified' ? 'Verified' : 'Pending') as 'Pending' | 'Verified' | 'Discrepancy',
        verified: row.verified === true || row.status === 'Verified'
      }));
    } catch {
      return [];
    }
  },

  verifyAttendanceRecords: async (ids: string[]) => {
    const res = await axios.post(`${API_BASE}/DeptVerification/VerifyAttendance`, { ids });
    return res.data;
  },

  // 10. Attendance Reports Layout Services
  getMusterRollReport: async (fromDate: string, toDate: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/MusterRoll`, {
        params: { fromDate, ToDate: toDate }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getShiftWiseAttendanceReport: async (date: string, etype: string = 'ALL'): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/GetShiftWiseAttendance`, {
        params: { Dt: date, etype: etype || 'ALL' }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getPlanVsActualReport: async (date: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/DeptWisePlanVsActual`, {
        params: { forDate: date }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getDailyArrivalReport: async (date: string, ezone: string = 'ALL'): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/DailyArrival`, {
        params: { Dt: date, ezone: ezone || 'ALL' }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getPeriodicApiReport: async (fromDate: string, toDate: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/PeriodicApiManpowerReport`, {
        params: { Dt: fromDate, UpToDate: toDate }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getDeptWiseCategoryWiseAttendance: async (date: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/DeptWiseCategoryWiseAttendance`, {
        params: { ForDate: date }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getDepartmentwiseApi: async (date: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/DepartmentwiseApi`, {
        params: { Dt: date }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getIndividualAttendance: async (empCode: string, fromDate: string, toDate: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/GetEmployeeAttendancequery`, {
        params: { EmpCode: empCode, FDt: fromDate, ToDt: toDate }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getDeptwiseManpowerByDate: async (date: string): Promise<any[]> => {
    try {
      const res = await axios.get(`${API_BASE}/AttendanceReportLayout/DeptwiseManpowerALLByDate`, {
        params: { Dt: date }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
};


