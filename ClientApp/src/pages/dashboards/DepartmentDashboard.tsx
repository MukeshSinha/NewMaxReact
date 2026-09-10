import React, { useEffect, useState } from 'react';
import { Layers, UserCheck, ShieldAlert, CheckSquare } from 'lucide-react';
import { SummaryCard } from '../../components/common/SummaryCard';
import { DataTable } from '../../components/common/DataTable';
import { maxpayService } from '../../services/maxpayService';
import { ContractorManpower, DeptManpower } from '../../types/maxpay.types';

export const DepartmentDashboard: React.FC = () => {
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
      const [contRes, deptRes] = await Promise.all([
        maxpayService.getContractorTodayManpowerForDept(contractorDate),
        maxpayService.getDeptwiseManpowerALLForDept(deptDate),
      ]);
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
      const contRes = await maxpayService.getContractorTodayManpowerForDept(dateVal);
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
      const deptRes = await maxpayService.getDeptwiseManpowerALLForDept(dateVal);
      setDepartments(Array.isArray(deptRes) ? deptRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDept(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const safeContractors = Array.isArray(contractors) ? contractors : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];

  const totalContractorReg = safeContractors.reduce((acc, c) => acc + (c.regular || 0), 0);
  const totalContractorFot = safeContractors.reduce((acc, c) => acc + (c.fot || 0), 0);
  const totalContractorToa = safeContractors.reduce((acc, c) => acc + (c.toa || 0), 0);
  const totalContractorAll = safeContractors.reduce((acc, c) => acc + (c.total || 0), 0);

  const totalDeptReg = safeDepartments.reduce((acc, d) => acc + (d.regular || 0), 0);
  const totalDeptFot = safeDepartments.reduce((acc, d) => acc + (d.fot || 0), 0);
  const totalDeptToa = safeDepartments.reduce((acc, d) => acc + (d.toa || 0), 0);
  const totalDeptAll = safeDepartments.reduce((acc, d) => acc + (d.total || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Department Head Dashboard</h1>
        <p className="text-xs text-slate-400">Department Contractor & Department Wise Manpower Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard title="Contractor Manpower" value={totalContractorAll} icon={Layers} gradient="bg-indigo-500" />
        <SummaryCard title="Dept Manpower" value={totalDeptAll} icon={UserCheck} gradient="bg-emerald-500" />
        <SummaryCard title="Regular Present" value={totalDeptReg} icon={CheckSquare} gradient="bg-purple-500" />
        <SummaryCard title="FOT & NAPS" value={totalDeptFot + totalDeptToa} icon={ShieldAlert} gradient="bg-amber-500" />
      </div>

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
          exportFileName="Dept_Contractor_Manpower"
          searchPlaceholder="Search contractor..."
          columns={[
            { header: 'Contractor', accessor: 'ezone', className: 'font-semibold text-indigo-300' },
            { header: 'CONT.', accessor: 'regular', className: 'text-center font-medium' },
            { header: 'FOT', accessor: 'fot', className: 'text-center font-medium' },
            { header: 'NAPS', accessor: 'toa', className: 'text-center font-medium' },
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
          title="Department Wise Manpower"
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
          exportFileName="Department_Wise_Manpower"
          searchPlaceholder="Search department..."
          columns={[
            { header: 'Department', accessor: 'dept', className: 'font-semibold text-indigo-300' },
            { header: 'CONT', accessor: 'regular', className: 'text-center font-medium' },
            { header: 'FOT', accessor: 'fot', className: 'text-center font-medium' },
            { header: 'NAPS', accessor: 'toa', className: 'text-center font-medium' },
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
