import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Clock,
  Building2,
  Calendar,
  CheckCircle,
  Play,
  Users,
  Search,
  CheckSquare,
  Square,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import { maxpayService } from '../../services/maxpayService';
import { ShiftRotationRecord, Employee } from '../../types/maxpay.types';

export const ShiftRotationPage: React.FC = () => {
  const [rotations, setRotations] = useState<ShiftRotationRecord[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [contractors, setContractors] = useState<{ id: number; itemName: string }[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [shifts, setShifts] = useState<{ code: string; inTime: string; outTime: string; isNight: boolean }[]>([]);
  const [fromShift, setFromShift] = useState<string>('');
  const [toShift, setToShift] = useState<string>('');
  const [cycle, setCycle] = useState<'Weekly' | 'Bi-Weekly' | 'Monthly'>('Weekly');
  const [effectiveFrom, setEffectiveFrom] = useState<string>(
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmps, setSelectedEmps] = useState<Set<string>>(new Set());
  const [searchEmp, setSearchEmp] = useState<string>('');
  const [applying, setApplying] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [rotList, deptList, contList, empList, shiftList] = await Promise.all([
      maxpayService.getShiftRotationRules(),
      maxpayService.getDepartmentsList(),
      maxpayService.getContractorList(),
      maxpayService.getEmployees(),
      maxpayService.getShiftsList(),
    ]);
    setRotations(rotList);
    const validDepts = deptList.filter((d) => d !== 'ALL');
    setDepartments(validDepts);
    if (validDepts.length > 0) setSelectedDept(validDepts[0]);
    setContractors(contList);
    if (contList.length > 0) setSelectedContractor(contList[0].itemName);

    setEmployees(empList);
    setSelectedEmps(new Set(empList.map((e) => e.empCode)));
    setShifts(shiftList);
    if (shiftList.length > 0) {
      setFromShift(shiftList[0].code);
      setToShift(shiftList.length > 1 ? shiftList[1].code : shiftList[0].code);
    }
  };

  const handleToggleEmp = (code: string) => {
    setSelectedEmps((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleApplyRotation = async () => {
    if (fromShift === toShift) {
      toast.error('Source and destination shifts cannot be identical.');
      return;
    }
    if (selectedEmps.size === 0) {
      toast.error('Please select at least one employee to rotate.');
      return;
    }

    setApplying(true);
    try {
      const newRule: ShiftRotationRecord = {
        id: `ROT-0${rotations.length + 1}`,
        department: selectedDept,
        contractor: selectedContractor,
        currentShift: fromShift,
        nextShift: toShift,
        rotationCycle: cycle,
        effectiveFrom,
        empCount: selectedEmps.size,
        status: 'Active',
        employeeCodes: Array.from(selectedEmps),
        shiftSequence: [fromShift, toShift],
        effectiveDate: effectiveFrom,
      };

      await maxpayService.saveShiftRotation(newRule);
      setRotations((prev) => [newRule, ...prev]);
      toast.success(
        `Shift Rotation applied! ${selectedEmps.size} workers in ${selectedDept} shifted from ${fromShift} to ${toShift}.`
      );
    } catch {
      toast.error('Failed to apply shift rotation');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
            <RotateCw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Shift Rotation Setup</h1>
            <p className="text-xs text-slate-500">
              Automate cyclical workforce shift transfers (A → B → C) across departments and contractors
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-mono self-start sm:self-auto">
          Area: TimeOffice / ShiftRotation
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rotation Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-cyan-600" />
              Configure Rotation Matrix
            </h2>

            <div className="space-y-3.5 text-xs">
              {/* Department */}
              <div>
                <label className="flex items-center gap-1.5 text-slate-700 font-medium mb-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                  Target Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-cyan-500 focus:outline-none font-medium"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contractor */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Contractor</label>
                <select
                  value={selectedContractor}
                  onChange={(e) => setSelectedContractor(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-cyan-500 focus:outline-none font-medium"
                >
                  {contractors.map((c) => (
                    <option key={c.id} value={c.itemName}>
                      {c.itemName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Flow */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  Shift Transition Flow:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">From Shift</span>
                    <select
                      value={fromShift}
                      onChange={(e) => setFromShift(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                    >
                      {shifts.length === 0 ? (
                        <option value="">No shifts loaded</option>
                      ) : (
                        shifts.map((s) => (
                          <option key={s.code} value={s.code}>
                            Shift {s.code} {s.inTime && s.outTime ? `(${s.inTime}-${s.outTime})` : ''}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">To Shift (Next)</span>
                    <select
                      value={toShift}
                      onChange={(e) => setToShift(e.target.value)}
                      className="w-full bg-white border border-cyan-500 rounded-lg px-2 py-1.5 text-xs text-cyan-700 font-semibold"
                    >
                      {shifts.length === 0 ? (
                        <option value="">No shifts loaded</option>
                      ) : (
                        shifts.map((s) => (
                          <option key={s.code} value={s.code}>
                            Shift {s.code} {s.inTime && s.outTime ? `(${s.inTime}-${s.outTime})` : ''}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Frequency Cycle */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Rotation Frequency</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {(['Weekly', 'Bi-Weekly', 'Monthly'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCycle(c)}
                      className={`py-1.5 rounded-lg text-center font-medium transition-all ${
                        cycle === c
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Effective From */}
              <div>
                <label className="flex items-center gap-1.5 text-slate-700 font-medium mb-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                  Effective Rotation Date
                </label>
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Employee Selection Checklist */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Users className="w-3.5 h-3.5 text-cyan-600" />
                    Assigned Employees
                  </label>
                  <span className="text-[11px] font-mono text-cyan-700 font-bold">
                    {selectedEmps.size} / {employees.length} Selected
                  </span>
                </div>

                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filter employees by name or code..."
                    value={searchEmp}
                    onChange={(e) => setSearchEmp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="border border-slate-200 rounded-xl bg-slate-50 p-2 max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                  {employees.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-xs font-sans">
                      No employees available.
                    </div>
                  ) : (
                    employees
                      .filter(
                        (emp) =>
                          !searchEmp ||
                          emp.empCode.toLowerCase().includes(searchEmp.toLowerCase()) ||
                          emp.name.toLowerCase().includes(searchEmp.toLowerCase()) ||
                          (emp.department && emp.department.toLowerCase().includes(searchEmp.toLowerCase()))
                      )
                      .map((emp) => {
                        const isChecked = selectedEmps.has(emp.empCode);
                        return (
                          <div
                            key={emp.empCode}
                            onClick={() => handleToggleEmp(emp.empCode)}
                            className={`flex items-center justify-between p-1.5 rounded-lg border text-xs cursor-pointer ${
                              isChecked
                                ? 'bg-cyan-50 border-cyan-200 text-cyan-900'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isChecked ? (
                                <CheckSquare className="w-3.5 h-3.5 text-cyan-600" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="font-mono text-cyan-700 font-semibold">{emp.empCode}</span>
                              <span className="truncate max-w-[140px] text-slate-800 font-medium">{emp.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{emp.department}</span>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyRotation}
                disabled={applying}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Play className={`w-3.5 h-3.5 ${applying ? 'animate-spin' : ''}`} />
                <span>{applying ? 'Applying Rotation...' : 'Execute Shift Rotation'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Active Rotation Rules */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-cyan-600" />
                <h2 className="text-sm font-semibold text-slate-800">Active Rotation Cycles & Schedules</h2>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-mono border border-cyan-200">
                {rotations.length} Active Rules
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">Rule ID</th>
                    <th className="py-2.5 px-3 font-semibold">Dept & Contractor</th>
                    <th className="py-2.5 px-3 font-semibold">Shift Transition</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Frequency</th>
                    <th className="py-2.5 px-3 font-semibold">Effective From</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Workers</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {rotations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                        No shift rotation rules active.
                      </td>
                    </tr>
                  ) : (
                    rotations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 text-cyan-700 font-semibold">{r.id}</td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-semibold text-slate-800">{r.department}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            {r.contractor}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
                              {r.currentShift.split(' ')[0]}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold text-[10px]">
                              {r.nextShift.split(' ')[0]}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                            {r.rotationCycle}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{r.effectiveFrom}</td>
                        <td className="py-2.5 px-3 text-center text-cyan-700 font-bold">{r.empCount}</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            {r.status}
                          </span>
                        </td>
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
