import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarRange,
  Search,
  Filter,
  Save,
  Download,
  Building2,
  Calendar,
  CheckCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { maxpayService } from '../../services/maxpayService';
import { ShiftRosterGridRow } from '../../types/maxpay.types';

export const ShiftRoasterPage: React.FC = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [department, setDepartment] = useState<string>('ALL');
  const [departments, setDepartments] = useState<string[]>([]);
  const [rosterRows, setRosterRows] = useState<ShiftRosterGridRow[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedShiftForFill, setSelectedShiftForFill] = useState<string>('A');
  const [saving, setSaving] = useState<boolean>(false);

  // Compute number of days in selected month and year
  const daysInMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [month, year]);

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  useEffect(() => {
    loadDepartments();
    loadRoster();
  }, [month, year, department]);

  const loadDepartments = async () => {
    const list = await maxpayService.getDepartmentsList();
    setDepartments(list);
  };

  const loadRoster = async () => {
    const data = await maxpayService.getShiftRosterData(month, year, department);
    setRosterRows(data);
  };

  const handleCellChange = (empCode: string, day: number, newShift: string) => {
    setRosterRows((prev) =>
      prev.map((row) => {
        if (row.empCode !== empCode) return row;
        return {
          ...row,
          shifts: {
            ...row.shifts,
            [day]: newShift,
          },
        };
      })
    );
  };

  const handleQuickFillWeekoffs = () => {
    setRosterRows((prev) =>
      prev.map((row) => {
        const updatedShifts = { ...row.shifts };
        daysArray.forEach((d) => {
          const dateObj = new Date(year, month - 1, d);
          if (dateObj.getDay() === 0) {
            // Sunday
            updatedShifts[d] = 'WO';
          }
        });
        return { ...row, shifts: updatedShifts };
      })
    );
    toast.success('Applied "WO" (Weekly Off) to all Sundays in the active month.');
  };

  const handleSaveRoster = async () => {
    setSaving(true);
    try {
      await maxpayService.saveShiftRosterData(rosterRows);
      toast.success('Shift Roster successfully saved and synced to database!');
    } catch {
      toast.error('Failed to save Shift Roster');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['EmpCode', 'Name', 'Department', ...daysArray.map((d) => `Day_${d}`)];
    const rows = filteredRows.map((r) => [
      r.empCode,
      `"${r.empName}"`,
      r.department,
      ...daysArray.map((d) => r.shifts[d] || 'G1'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Shift_Roster_${year}_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded Shift Roster CSV export');
  };

  const filteredRows = useMemo(() => {
    return rosterRows.filter((row) => {
      const matchesDept = department === 'ALL' || row.department.toUpperCase() === department.toUpperCase();
      const matchesSearch =
        row.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.empName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [rosterRows, department, searchQuery]);

  const getShiftBadgeClass = (shift: string) => {
    switch (shift) {
      case 'WO':
        return 'bg-blue-100 text-blue-800 border border-blue-300 font-bold';
      case 'A':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold';
      case 'B':
        return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
      case 'C':
        return 'bg-purple-100 text-purple-800 border border-purple-300 font-bold';
      case 'G1':
      case 'G2':
        return 'bg-slate-100 text-slate-700 border border-slate-300';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  const cycleShift = (current: string) => {
    const cycleList = ['G1', 'A', 'B', 'C', 'WO'];
    const idx = cycleList.indexOf(current);
    if (idx === -1 || idx === cycleList.length - 1) return cycleList[0];
    return cycleList[idx + 1];
  };

  return (
    <div className="space-y-6 max-w-full mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-600/20">
            <CalendarRange className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Monthly Shift Roaster</h1>
            <p className="text-xs text-slate-500">
              Interactive monthly duty planning matrix with day-by-day shift allocation & automated weekoffs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-300 transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleSaveRoster}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Saving...' : 'Save Roaster'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Month */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Month:</span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:border-indigo-500"
            >
              {[
                { num: 1, name: 'January' },
                { num: 2, name: 'February' },
                { num: 3, name: 'March' },
                { num: 4, name: 'April' },
                { num: 5, name: 'May' },
                { num: 6, name: 'June' },
                { num: 7, name: 'July' },
                { num: 8, name: 'August' },
                { num: 9, name: 'September' },
                { num: 10, name: 'October' },
                { num: 11, name: 'November' },
                { num: 12, name: 'December' },
              ].map((m) => (
                <option key={m.num} value={m.num}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Year:</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:border-indigo-500"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Department:</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:border-indigo-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Quick Tools & Legend */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleQuickFillWeekoffs}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-medium flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Fill Sunday W/O</span>
          </button>

          <div className="hidden xl:flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className="text-slate-500 text-[11px]">Legend:</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              A (Morn)
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
              B (Eve)
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              C (Night)
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
              G1 (Gen)
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              WO (Off)
            </span>
          </div>
        </div>
      </div>

      {/* Roster Grid Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[580px] custom-scrollbar">
          <table className="w-full text-[11px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 sticky top-0 z-20">
                <th className="py-2.5 px-3 font-semibold sticky left-0 bg-slate-50 z-30 min-w-[140px] border-r border-slate-200">
                  Emp Code & Name
                </th>
                <th className="py-2.5 px-2 font-semibold min-w-[80px] border-r border-slate-200">
                  Dept
                </th>
                {daysArray.map((day) => {
                  const dateObj = new Date(year, month - 1, day);
                  const isSunday = dateObj.getDay() === 0;
                  return (
                    <th
                      key={day}
                      className={`py-2 px-1 text-center font-mono min-w-[34px] border-r border-slate-200 ${
                        isSunday ? 'bg-indigo-50/80 text-indigo-700 font-bold' : ''
                      }`}
                    >
                      <div>{day}</div>
                      <div className="text-[9px] font-sans text-slate-400">
                        {dateObj.toLocaleDateString('en-US', { weekday: 'narrow' })}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth + 2} className="text-center py-10 text-slate-400 font-sans">
                    No roster entries found for the selected month and department.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.empCode} className="hover:bg-slate-50/80">
                    {/* Fixed Left Employee Column */}
                    <td className="py-2 px-3 sticky left-0 bg-white/95 z-10 border-r border-slate-200">
                      <div className="font-semibold text-slate-800 font-sans truncate max-w-[130px]">
                        {row.empName}
                      </div>
                      <div className="text-[10px] text-indigo-600 font-mono">{row.empCode}</div>
                    </td>

                    {/* Department */}
                    <td className="py-2 px-2 text-slate-500 font-sans text-[10px] border-r border-slate-200 truncate max-w-[80px]">
                      {row.department}
                    </td>

                    {/* Day Cells */}
                    {daysArray.map((day) => {
                      const currentVal = row.shifts[day] || 'G1';
                      const dateObj = new Date(year, month - 1, day);
                      const isSunday = dateObj.getDay() === 0;

                      return (
                        <td
                          key={day}
                          className={`p-0.5 text-center border-r border-slate-100 ${
                            isSunday ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleCellChange(row.empCode, day, cycleShift(currentVal))}
                            title={`Day ${day}: Click to rotate (${currentVal})`}
                            className={`w-7 h-6 rounded flex items-center justify-center text-[10px] transition-all hover:scale-105 mx-auto ${getShiftBadgeClass(
                              currentVal
                            )}`}
                          >
                            {currentVal}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
