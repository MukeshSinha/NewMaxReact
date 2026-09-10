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
