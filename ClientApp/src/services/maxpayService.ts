import axios from 'axios';
import { ManpowerSummary, ContractorManpower, DeptManpower, Employee, AttendanceRecord } from '../types/maxpay.types';

const API_BASE = '/api';

export const maxpayService = {
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
  }
};
