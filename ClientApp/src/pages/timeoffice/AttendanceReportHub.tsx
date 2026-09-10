import React, { useEffect, useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import axios from 'axios';

export const AttendanceReportHub: React.FC = () => {
  const [reportType, setReportType] = useState('MusterRoll');
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        let url = '/api/AttendanceReportLayout/MusterRoll';
        let params: any = { fromDate: today, ToDate: today };

        if (reportType === 'Absenteeism') {
          url = '/api/AttendanceReportLayout/DailyDeptAbsenteeism';
          params = { forDate: today };
        } else if (reportType === 'PlanVsActual') {
          url = '/api/AttendanceReportLayout/DeptWisePlanVsActual';
          params = { forDate: today };
        }

        const res = await axios.get(url, { params });
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        setReportData(Array.isArray(data) ? data : []);
      } catch {
        setReportData([]);
      }
    };

    fetchReport();
  }, [reportType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Attendance Report Hub</h1>
          <p className="text-xs text-slate-400">Generate Muster Roll, Absenteeism & Shift Plan vs Actual Reports</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {['MusterRoll', 'Absenteeism', 'PlanVsActual'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reportType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type === 'MusterRoll' ? 'Muster Roll' : type === 'Absenteeism' ? 'Absenteeism' : 'Plan vs Actual'}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        title={`${reportType === 'MusterRoll' ? 'Monthly Muster Roll Report' : reportType === 'Absenteeism' ? 'Daily Absenteeism Ledger' : 'Shift Planned vs Actual Attendance'}`}
        data={reportData}
        exportFileName={`Attendance_Report_${reportType}`}
        columns={[
          { header: 'Emp Code', accessor: 'empCode', className: 'font-semibold text-indigo-400 font-mono' },
          { header: 'Employee Name', accessor: 'name', className: 'font-bold text-white' },
          { header: 'Contractor', accessor: 'contractor' },
          { header: 'Department', accessor: 'dept' },
          { header: 'Present Days', accessor: 'pDays', className: 'text-center font-bold text-emerald-400' },
          { header: 'Absent Days', accessor: 'aDays', className: 'text-center font-bold text-red-400' },
          { header: 'Week Off', accessor: 'wOff', className: 'text-center font-medium text-slate-300' },
          { header: 'OT Hours', accessor: 'otHrs', className: 'text-center font-mono text-purple-400 font-bold' },
        ]}
      />
    </div>
  );
};
