import React, { useState, useEffect, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Clock,
  Calendar,
  Save,
  Building2,
  Moon,
  Sun,
  ShieldCheck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { maxpayService } from '../../services/maxpayService';
import { EmployeeShiftDetail } from '../../types/maxpay.types';

export const EmployeeShiftPage: React.FC = () => {
  const [shiftsList, setShiftsList] = useState<EmployeeShiftDetail[]>([]);
  const [empCode, setEmpCode] = useState<string>('');
  const [empName, setEmpName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [contractor, setContractor] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState<string>('G1 (General 1)');
  const [inTime, setInTime] = useState<string>('08:30');
  const [outTime, setOutTime] = useState<string>('17:00');
  const [workHrs, setWorkHrs] = useState<string>('8.5');
  const [isNight, setIsNight] = useState<boolean>(false);
  const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadShiftData();
  }, []);

  const loadShiftData = async () => {
    const list = await maxpayService.getEmployeeShiftDetails();
    setShiftsList(list);
  };

  const handleLookupEmp = async () => {
    if (!empCode) return;
    const employees = await maxpayService.getEmployees();
    const found = employees.find((e) => e.empCode.toLowerCase() === empCode.toLowerCase());
    if (found) {
      setEmpName(found.name);
      setDepartment(found.department);
      setContractor(found.contractor);
      toast.success(`Loaded details for ${found.name}`);
    } else {
      toast.error(`Employee ${empCode} not found`);
    }
  };

  const handleShiftSelectChange = (val: string) => {
    setSelectedShift(val);
    if (val.includes('Shift A')) {
      setInTime('06:00');
      setOutTime('14:30');
      setWorkHrs('8.5');
      setIsNight(false);
    } else if (val.includes('Shift B')) {
      setInTime('14:30');
      setOutTime('23:00');
      setWorkHrs('8.5');
      setIsNight(false);
    } else if (val.includes('Shift C')) {
      setInTime('23:00');
      setOutTime('07:30');
      setWorkHrs('8.5');
      setIsNight(true);
    } else if (val.includes('G2')) {
      setInTime('09:00');
      setOutTime('18:00');
      setWorkHrs('9.0');
      setIsNight(false);
    } else {
      // G1
      setInTime('08:30');
      setOutTime('17:00');
      setWorkHrs('8.5');
      setIsNight(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empCode || !empName) {
      toast.error('Please specify valid employee');
      return;
    }

    setSaving(true);
    try {
      const updatedItem: EmployeeShiftDetail = {
        empCode,
        empName,
        department,
        contractor,
        shiftName: selectedShift,
        inTime,
        outTime,
        workHrs,
        isNight,
        effectiveDate,
      };

      await maxpayService.updateEmployeeShift(updatedItem);
      setShiftsList((prev) => {
        const filtered = prev.filter((s) => s.empCode !== empCode);
        return [updatedItem, ...filtered];
      });
      toast.success(`Shift updated to ${selectedShift} for ${empName}!`);
    } catch {
      toast.error('Failed to update employee shift');
    } finally {
      setSaving(false);
    }
  };

  const filteredShifts = useMemo(() => {
    return shiftsList.filter(
      (s) =>
        s.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shiftName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shiftsList, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Employee Shift Assignment</h1>
            <p className="text-xs text-slate-500">
              Individual shift mapping, standard in/out timings, daily working hours, and night shift flags
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-mono self-start sm:self-auto">
          Area: TimeOffice / EmployeeShift
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assignment Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-emerald-600" />
              Assign / Modify Employee Shift
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Employee Code */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Employee Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    onBlur={handleLookupEmp}
                    placeholder="Enter Emp Code"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleLookupEmp}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-medium"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              {/* Employee Info preview */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Name:</span>
                  <span className="text-slate-800 font-medium">{empName || '-'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Dept:</span>
                  <span className="text-emerald-700 font-semibold">{department || '-'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Contractor:</span>
                  <span className="text-slate-700 truncate max-w-[170px]">{contractor || '-'}</span>
                </div>
              </div>

              {/* Shift Name */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Assigned Shift</label>
                <select
                  value={selectedShift}
                  onChange={(e) => handleShiftSelectChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-emerald-500 focus:outline-none font-medium"
                >
                  <option value="G1 (General 1)">G1 - General 1 (08:30 - 17:00)</option>
                  <option value="Shift A">Shift A (06:00 - 14:30)</option>
                  <option value="Shift B">Shift B (14:30 - 23:00)</option>
                  <option value="Shift C">Shift C - Night (23:00 - 07:30)</option>
                  <option value="G2 (General 2)">G2 - General 2 (09:00 - 18:00)</option>
                </select>
              </div>

              {/* Shift Timing Details (In, Out, WorkHrs) */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1 text-[11px]">In Time</label>
                  <input
                    type="text"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1 text-[11px]">Out Time</label>
                  <input
                    type="text"
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1 text-[11px]">Work Hrs</label>
                  <input
                    type="text"
                    value={workHrs}
                    onChange={(e) => setWorkHrs(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-emerald-600 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Night Shift Toggle & Effective Date */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={isNight}
                      onChange={(e) => setIsNight(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="flex items-center gap-1">
                      {isNight ? <Moon className="w-3.5 h-3.5 text-purple-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                      Is Night Shift
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Updating...' : 'Assign Shift'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftSelectChange('G1 (General 1)')}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Default</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Employee Shift Master Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-semibold text-slate-800">Employee Shift Directory</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono border border-emerald-200">
                  {filteredShifts.length} Assigned
                </span>
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter shift assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">Employee</th>
                    <th className="py-2.5 px-3 font-semibold">Shift Name</th>
                    <th className="py-2.5 px-3 font-semibold">In - Out</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Work Hrs</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Night</th>
                    <th className="py-2.5 px-3 font-semibold">Effective</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredShifts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 font-sans">
                        No shift assignments match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredShifts.map((s) => (
                      <tr key={s.empCode} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-semibold text-slate-800">{s.empName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {s.empCode} • {s.department}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-[11px]">
                            {s.shiftName}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {s.inTime} - {s.outTime}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{s.workHrs}</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          {s.isNight ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              <Moon className="w-3 h-3" /> Yes
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{s.effectiveDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
