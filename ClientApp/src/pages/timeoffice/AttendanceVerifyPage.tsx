import React, { useEffect, useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { maxpayService } from '../../services/maxpayService';
import { AttendanceRecord } from '../../types/maxpay.types';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const AttendanceVerifyPage: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    maxpayService.getAttendanceRecords().then(setAttendance);
  }, []);

  const handleVerify = (empCode: string, approve: boolean) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.empCode === empCode
          ? { ...item, verificationStatus: approve ? 'Verified' : 'Rejected' }
          : item
      )
    );
    if (approve) {
      toast.success(`Record for ${empCode} approved`);
    } else {
      toast.error(`Record for ${empCode} rejected`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Department Supervisor Attendance Verification</h1>
        <p className="text-xs text-slate-400">Review & Verify Shift Punch Logs before Salary Processing</p>
      </div>

      <DataTable
        title="Pending & Verified Punch Records"
        data={attendance}
        exportFileName="Attendance_Verification_List"
        columns={[
          { header: 'Emp Code', accessor: 'empCode', className: 'font-semibold text-indigo-400 font-mono' },
          { header: 'Name', accessor: 'name', className: 'font-bold text-white' },
          { header: 'Department', accessor: 'department' },
          { header: 'Punch In', accessor: 'punchTime', className: 'font-mono text-emerald-400' },
          { header: 'Punch Out', accessor: 'prevPunchTime', className: 'font-mono text-indigo-400' },
          {
            header: 'Status',
            accessor: (r) => (
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${r.verificationStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : r.verificationStatus === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                {r.verificationStatus}
              </span>
            ),
          },
          {
            header: 'Actions',
            accessor: (r) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVerify(r.empCode, true)}
                  className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  title="Approve"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleVerify(r.empCode, false)}
                  className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  title="Reject"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
