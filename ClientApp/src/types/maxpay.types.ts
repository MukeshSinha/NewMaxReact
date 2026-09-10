export interface ManpowerSummary {
  regular: number;
  fot: number;
  toa: number;
  rollReg: number;
  rollFot: number;
  rollToa: number;
}

export interface ContractorManpower {
  ezone: string;
  regular: number;
  fot: number;
  toa: number;
  total: number;
}

export interface DeptManpower {
  dept: string;
  regular: number;
  fot: number;
  toa: number;
  total: number;
}

export interface Employee {
  empCode: string;
  name: string;
  contractor: string;
  department: string;
  category: string;
  joiningDate: string;
  status: string;
  mobile?: string;
  aadhar?: string;
  bankAccount?: string;
  dojoStatus?: string;
}

export interface AttendanceRecord {
  empCode: string;
  name: string;
  department: string;
  contractor: string;
  date: string;
  punchTime: string;
  prevPunchTime: string;
  shift: string;
  status: string;
  verificationStatus: string;
}

export interface UserProfile {
  username: string;
  role: 'Admin' | 'Contractor' | 'Department' | 'Dojo';
  token: string;
}

export interface LeaveBalanceItem {
  leaveType: string;
  open: number;
  avail: number;
  balance: number;
}

export interface LeaveRequestData {
  id?: string;
  empCode: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  session: '1st Half' | '2nd Half' | 'Full Day';
  reason: string;
  wasInformed: boolean;
  appliedDate?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface RecentAttendanceItem {
  date: string;
  shift: string;
  inTime: string;
  outTime: string;
  status: string;
  gatepass: number;
}

export interface WeekoffTransferRecord {
  id: string;
  empCode: string;
  empName: string;
  department: string;
  contractor: string;
  currentWeekoff: string;
  requestedWeekoff: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface ForgetPunchRecord {
  id: string;
  empCode: string;
  empName: string;
  department: string;
  date: string;
  punchType: 'In' | 'Out' | 'Both';
  actualTime: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  verifiedBy?: string;
}

export interface ShiftRotationRecord {
  id: string;
  department: string;
  contractor: string;
  currentShift: string;
  nextShift: string;
  rotationCycle: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  effectiveFrom: string;
  empCount: number;
  status: 'Active' | 'Scheduled' | 'Completed';
  employeeCodes?: string[];
  shiftSequence?: string[];
  effectiveDate?: string;
}

export interface EmployeeShiftDetail {
  empCode: string;
  empName: string;
  department: string;
  contractor: string;
  shiftName: string;
  inTime: string;
  outTime: string;
  workHrs: string;
  isNight: boolean;
  effectiveDate: string;
}

export interface ShiftRosterGridRow {
  empCode: string;
  empName: string;
  department: string;
  contractor: string;
  shifts: { [day: number]: string };
}

export interface AttendanceVerifyRecord {
  id: string;
  empCode: string;
  name: string;
  department: string;
  category: string;
  shift: string;
  inTime: string;
  outTime: string;
  workHrs: string;
  api: string;
  status: 'Pending' | 'Verified' | 'Discrepancy';
  verified: boolean;
}

export interface AttendanceReportDefinition {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'monthly' | 'manpower' | 'discrepancy';
  iconName: string;
  path: string;
}

