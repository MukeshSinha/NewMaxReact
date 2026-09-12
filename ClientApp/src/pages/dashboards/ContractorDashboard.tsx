import React, { useEffect, useState } from 'react';
import { Building2, Users, CheckCircle, Clock } from 'lucide-react';
import { SummaryCard } from '../../components/common/SummaryCard';
import { AttendanceCard } from '../../components/common/AttendanceCard';
import { DataTable } from '../../components/common/DataTable';
import { maxpayService } from '../../services/maxpayService';
import { ManpowerSummary } from '../../types/maxpay.types';

export const ContractorDashboard: React.FC = () => {
  const [summary, setSummary] = useState<ManpowerSummary>({
    regular: 0,
    fot: 0,
    toa: 0,
    rollReg: 0,
    rollFot: 0,
    rollToa: 0,
  });
  const [strengthList, setStrengthList] = useState<any[]>([]);
  const [todayManpower, setTodayManpower] = useState<any[]>([]);
  const [deptAllocation, setDeptAllocation] = useState<any[]>([]);
  
  const [manpowerDate, setManpowerDate] = useState<string>('');
  const [deptDate, setDeptDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingManpower, setLoadingManpower] = useState(false);
  const [loadingDept, setLoadingDept] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, strRes, manRes, deptRes] = await Promise.all([
        maxpayService.getTodayAttendance(),
        maxpayService.getContractorStrength(),
        maxpayService.getContractorTodayManpower(manpowerDate),
        maxpayService.getContractorDeptManpower(deptDate),
      ]);
      if (Array.isArray(sumRes) && sumRes.length > 0) setSummary(sumRes[0]);
      setStrengthList(Array.isArray(strRes) ? strRes : []);
      setTodayManpower(Array.isArray(manRes) ? manRes : []);
      setDeptAllocation(Array.isArray(deptRes) ? deptRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManpowerDateChange = async (dateVal: string) => {
    setManpowerDate(dateVal);
    setLoadingManpower(true);
    try {
      const res = await maxpayService.getContractorTodayManpower(dateVal);
      setTodayManpower(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingManpower(false);
    }
  };

  const handleDeptDateChange = async (dateVal: string) => {
    setDeptDate(dateVal);
    setLoadingDept(true);
    try {
      const res = await maxpayService.getContractorDeptManpower(dateVal);
      setDeptAllocation(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDept(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalStrengthBalance = strengthList.reduce((acc, s) => acc + parseInt(s.balance || 0), 0);
  const totalManpowerAll = todayManpower.reduce((acc, m) => acc + parseInt(m.total || 0), 0);
  const totalDeptAll = deptAllocation.reduce((acc, d) => acc + parseInt(d.totalManpower || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">Contractor Overview Dashboard</h1>
        <p className="text-xs text-slate-500">Assigned Strength, Today Manpower & Department Allocation</p>
      </div>

      {/* Top 3 Attendance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AttendanceCard
          title="Today's Regular Attendance"
          onRoll={summary.rollReg}
          present={summary.regular}
          leave=""
          weekOff=""
          variant="danger"
        />
        <AttendanceCard
          title="FOT"
          onRoll={summary.rollFot}
          present={summary.fot}
          leave=""
          weekOff=""
          variant="info"
        />
        <AttendanceCard
          title="TOA"
          onRoll={summary.rollToa}
          present={summary.toa}
          leave=""
          weekOff=""
          variant="success"
        />
      </div>

      {/* On Roll Strength Table */}
      <DataTable
        title="On Roll Strength This Month"
        isLoading={loading}
        data={strengthList}
        exportFileName="Contractor_Strength_This_Month"
        searchPlaceholder="Search category..."
        columns={[
          { header: 'Category', accessor: 'category', className: 'font-semibold text-indigo-700' },
          { header: 'Last On Roll', accessor: 'lastMonth', className: 'text-center font-medium' },
          { header: 'New Join', accessor: 'newJoin', className: 'text-center font-medium text-emerald-600' },
          { header: 'Leave', accessor: 'leave', className: 'text-center font-medium text-rose-600' },
          { header: 'Live as on Date', accessor: 'balance', className: 'text-center font-bold text-amber-600' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today Manpower Table */}
        <DataTable
          title="Today Manpower"
          isLoading={loading || loadingManpower}
          headerControls={
            <div className="flex items-center gap-2 text-xs ml-2">
              <span className="text-slate-500 font-medium">For other date</span>
              <input
                type="date"
                value={manpowerDate}
                onChange={(e) => handleManpowerDateChange(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          }
          data={todayManpower}
          exportFileName="Contractor_Today_Manpower"
          searchPlaceholder="Search contractor..."
          columns={[
            { header: 'Contractor', accessor: 'ezone', className: 'font-semibold text-indigo-700' },
            { header: 'Regular', accessor: 'regular', className: 'text-center font-medium' },
            { header: 'FOT', accessor: 'fot', className: 'text-center font-medium' },
            { header: 'TOA', accessor: 'toa', className: 'text-center font-medium' },
            { header: 'TOTAL', accessor: 'total', className: 'text-center font-bold text-emerald-600' },
          ]}
        />

        {/* Department Allocation Table */}
        <DataTable
          title="Department Allocation"
          isLoading={loading || loadingDept}
          headerControls={
            <div className="flex items-center gap-2 text-xs ml-2">
              <span className="text-slate-500 font-medium">For other date</span>
              <input
                type="date"
                value={deptDate}
                onChange={(e) => handleDeptDateChange(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          }
          data={deptAllocation}
          exportFileName="Contractor_Dept_Allocation"
          searchPlaceholder="Search department..."
          columns={[
            { header: 'Department', accessor: 'dept', className: 'font-semibold text-indigo-700' },
            { header: 'Regular', accessor: 'regular', className: 'text-center font-medium' },
            { header: 'FOT', accessor: 'fot', className: 'text-center font-medium' },
            { header: 'TOA', accessor: 'toa', className: 'text-center font-medium' },
            { header: 'TOTAL', accessor: (row) => row.totalManpower ?? row.total, className: 'text-center font-bold text-emerald-600' },
          ]}
        />
      </div>

      {/* Recent Tickets Table */}
      <DataTable
        title="Recent Tickets"
        data={[
          { assignee: 'Rahul Sharma', subject: '5 TOA requierd in Pin plant', status: 'DONE', lastUpdate: 'Jun 22, 2024', trackingId: 'WD-12345' },
          { assignee: 'Mukesh Dixit', subject: 'Required FOT in Piston Plant', status: 'PROGRESS', lastUpdate: 'Jun 22, 2024', trackingId: 'WD-12346' },
          { assignee: 'Surendra Rawat', subject: 'Manpower for API', status: 'ON HOLD', lastUpdate: 'Jul 01, 2024', trackingId: 'WD-12347' },
        ]}
        exportFileName="Recent_Tickets"
        searchPlaceholder="Search ticket..."
        columns={[
          { header: 'Assignee/Users', accessor: 'assignee', className: 'font-semibold text-indigo-700' },
          { header: 'Subject', accessor: 'subject', className: 'font-medium text-slate-700' },
          {
            header: 'Status',
            accessor: (row) => {
              const status = row.status;
              const color =
                status === 'DONE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : status === 'PROGRESS'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200';
              return (
                <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border uppercase ${color}`}>
                  {status}
                </span>
              );
            },
            className: 'text-center',
          },
          { header: 'Last Update', accessor: 'lastUpdate', className: 'text-center text-slate-500' },
          { header: 'Tracking ID', accessor: 'trackingId', className: 'text-center font-mono text-indigo-600 font-semibold' },
        ]}
      />
    </div>
  );
};
