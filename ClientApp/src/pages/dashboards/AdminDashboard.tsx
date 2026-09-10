import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Clock, Layers, Calendar, RefreshCw } from 'lucide-react';
import { SummaryCard } from '../../components/common/SummaryCard';
import { AttendanceCard } from '../../components/common/AttendanceCard';
import { DataTable } from '../../components/common/DataTable';
import { maxpayService } from '../../services/maxpayService';
import { ManpowerSummary, ContractorManpower, DeptManpower } from '../../types/maxpay.types';
import { useAppStore } from '../../store/appStore';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { selectedDate } = useAppStore();
  const [summary, setSummary] = useState<ManpowerSummary>({
    regular: 0,
    fot: 0,
    toa: 0,
    rollReg: 0,
    rollFot: 0,
    rollToa: 0,
  });
  const [contractors, setContractors] = useState<ContractorManpower[]>([]);
  const [departments, setDepartments] = useState<DeptManpower[]>([]);
  const [contractorDate, setContractorDate] = useState<string>('');
  const [deptDate, setDeptDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingContractor, setLoadingContractor] = useState(false);
  const [loadingDept, setLoadingDept] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, contRes, deptRes] = await Promise.all([
        maxpayService.getTodayAttendance(selectedDate),
        maxpayService.getContractorTodayManpower(contractorDate || selectedDate),
        maxpayService.getDeptwiseManpowerALL(deptDate || selectedDate),
      ]);
      if (Array.isArray(sumRes) && sumRes.length > 0) setSummary(sumRes[0]);
      setContractors(Array.isArray(contRes) ? contRes : []);
      setDepartments(Array.isArray(deptRes) ? deptRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContractorDateChange = async (dateVal: string) => {
    setContractorDate(dateVal);
    setLoadingContractor(true);
    try {
      const contRes = await maxpayService.getContractorTodayManpower(dateVal);
      setContractors(Array.isArray(contRes) ? contRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContractor(false);
    }
  };

  const handleDeptDateChange = async (dateVal: string) => {
    setDeptDate(dateVal);
    setLoadingDept(true);
    try {
      const deptRes = await maxpayService.getDeptwiseManpowerALL(dateVal);
      setDepartments(Array.isArray(deptRes) ? deptRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDept(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const safeContractors = Array.isArray(contractors) ? contractors : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];

  // Total summary calculation for Contractor table
  const totalContractorReg = safeContractors.reduce((acc, c) => acc + (c.regular || 0), 0);
  const totalContractorFot = safeContractors.reduce((acc, c) => acc + (c.fot || 0), 0);
  const totalContractorToa = safeContractors.reduce((acc, c) => acc + (c.toa || 0), 0);
  const totalContractorAll = safeContractors.reduce((acc, c) => acc + (c.total || 0), 0);

  // Total summary calculation for Department table
  const totalDeptReg = safeDepartments.reduce((acc, d) => acc + (d.regular || 0), 0);
  const totalDeptFot = safeDepartments.reduce((acc, d) => acc + (d.fot || 0), 0);
  const totalDeptToa = safeDepartments.reduce((acc, d) => acc + (d.toa || 0), 0);
  const totalDeptAll = safeDepartments.reduce((acc, d) => acc + (d.total || 0), 0);

  // Weekly Trend Chart Data
  const trendData = [
    { day: 'Mon', Regular: 440, FOT: 120, TOA: 80 },
    { day: 'Tue', Regular: 450, FOT: 125, TOA: 85 },
    { day: 'Wed', Regular: 462, FOT: 128, TOA: 88 },
    { day: 'Thu', Regular: 455, FOT: 122, TOA: 84 },
    { day: 'Fri', Regular: 468, FOT: 130, TOA: 90 },
    { day: 'Sat', Regular: 420, FOT: 110, TOA: 75 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Executive Manpower Dashboard</h1>
          <p className="text-xs text-slate-400">Live Contractor & Department Attendance Summary</p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
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

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Weekly Attendance Trend</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="Regular" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="FOT" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="TOA" stroke="#a855f7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Category Breakdown</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="dept" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="regular" fill="#10b981" name="Regular" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fot" fill="#6366f1" name="FOT" radius={[4, 4, 0, 0]} />
                <Bar dataKey="toa" fill="#a855f7" name="TOA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contractor Today Manpower Table */}
        <DataTable
          title="Today Contractor Manpower"
          isLoading={loading || loadingContractor}
          headerControls={
            <div className="flex items-center gap-2 text-xs ml-2">
              <span className="text-slate-400 font-medium">For other date</span>
              <input
                type="date"
                value={contractorDate}
                onChange={(e) => handleContractorDateChange(e.target.value)}
                className="bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          }
          data={contractors}
          exportFileName="Contractor_Today_Manpower"
          searchPlaceholder="Search contractor..."
          columns={[
            { header: 'Contractor Name', accessor: 'ezone', className: 'font-semibold text-indigo-300' },
            { header: 'Regular', accessor: 'regular', className: 'text-center font-medium' },
            { header: 'FOT', accessor: 'fot', className: 'text-center font-medium' },
            { header: 'TOA', accessor: 'toa', className: 'text-center font-medium' },
            { header: 'Total', accessor: 'total', className: 'text-center font-bold text-emerald-400' },
          ]}
          totalRow={
            <tr className="bg-slate-900 font-extrabold text-white border-t-2 border-indigo-500/50">
              <td className="p-3 text-right">TOTAL :</td>
              <td className="p-3 text-center text-emerald-400">{totalContractorReg}</td>
              <td className="p-3 text-center text-indigo-400">{totalContractorFot}</td>
              <td className="p-3 text-center text-purple-400">{totalContractorToa}</td>
              <td className="p-3 text-center text-amber-400">{totalContractorAll}</td>
            </tr>
          }
        />

        {/* Department-wise Manpower Table */}
        <DataTable
          title="Today Department Manpower"
          isLoading={loading || loadingDept}
          headerControls={
            <div className="flex items-center gap-2 text-xs ml-2">
              <span className="text-slate-400 font-medium">For other date</span>
              <input
                type="date"
                value={deptDate}
                onChange={(e) => handleDeptDateChange(e.target.value)}
                className="bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          }
          data={departments}
          exportFileName="Department_Today_Manpower"
          searchPlaceholder="Search department..."
          columns={[
            { header: 'Department', accessor: 'dept', className: 'font-semibold text-indigo-300' },
            { header: 'Regular', accessor: 'regular', className: 'text-center font-medium' },
            { header: 'FOT', accessor: 'fot', className: 'text-center font-medium' },
            { header: 'TOA', accessor: 'toa', className: 'text-center font-medium' },
            { header: 'Total', accessor: 'total', className: 'text-center font-bold text-emerald-400' },
          ]}
          totalRow={
            <tr className="bg-slate-900 font-extrabold text-white border-t-2 border-indigo-500/50">
              <td className="p-3 text-right">TOTAL :</td>
              <td className="p-3 text-center text-emerald-400">{totalDeptReg}</td>
              <td className="p-3 text-center text-indigo-400">{totalDeptFot}</td>
              <td className="p-3 text-center text-purple-400">{totalDeptToa}</td>
              <td className="p-3 text-center text-amber-400">{totalDeptAll}</td>
            </tr>
          }
        />
      </div>
    </div>
  );
};
