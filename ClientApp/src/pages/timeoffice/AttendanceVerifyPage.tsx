import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Calendar,
  Building2,
  Clock,
  Search,
  Download,
  Check,
  X,
  ShieldCheck,
  CheckSquare,
  Square,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { maxpayService } from '../../services/maxpayService';
import { AttendanceVerifyRecord } from '../../types/maxpay.types';

export const AttendanceVerifyPage: React.FC = () => {
  const [dateOf, setDateOf] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedShift, setSelectedShift] = useState<string>('ALL');
  const [records, setRecords] = useState<AttendanceVerifyRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);

  useEffect(() => {
    loadDepartments();
    handleFetchList();
  }, []);

  const loadDepartments = async () => {
    const depts = await maxpayService.getDepartmentsList();
    setDepartments(depts);
  };

  const handleFetchList = async () => {
    setLoading(true);
    try {
      const data = await maxpayService.getAttendanceVerificationList(dateOf, selectedDept, selectedShift);
      setRecords(data);
      // Auto select pending records for convenient verification
      const pendingIds = data.filter((r) => r.status === 'Pending').map((r) => r.id);
      setSelectedIds(new Set(pendingIds));
    } catch {
      toast.error('Failed to load attendance verification list');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    }
  };

  const handleSingleVerify = (id: string, isVerify: boolean) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: isVerify ? 'Verified' : 'Pending',
              verified: isVerify,
            }
          : r
      )
    );
    toast.success(`Record marked as ${isVerify ? 'Verified' : 'Pending'}`);
  };

  const handleBulkVerify = async () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one record to verify.');
      return;
    }

    setVerifying(true);
    try {
      await maxpayService.verifyAttendanceRecords(Array.from(selectedIds));
      setRecords((prev) =>
        prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: 'Verified', verified: true } : r))
      );
      toast.success(`Successfully verified ${selectedIds.size} attendance records!`);
      setSelectedIds(new Set());
    } catch {
      toast.error('Failed to verify attendance records');
    } finally {
      setVerifying(false);
    }
  };

  const handleExportExcel = () => {
    if (filteredRecords.length === 0) {
      toast.error('No attendance records to export.');
      return;
    }

    const headers = [
      'EmpCode',
      'Name',
      'Department',
      'Category',
      'Shift',
      'InTime',
      'OutTime',
      'WrkHrs',
      'API',
      'Status',
    ];
    const rows = filteredRecords.map((r) => [
      r.empCode,
      `"${r.name}"`,
      r.department,
      r.category,
      r.shift,
      r.inTime,
      r.outTime,
      r.workHrs,
      r.api,
      r.status,
    ]);

    const csv = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Attendance_Verify_List_${dateOf}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded Attendance Verification Excel/CSV');
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'ALL' || r.department.toUpperCase() === selectedDept.toUpperCase();
      const matchesShift = selectedShift === 'ALL' || r.shift.toUpperCase() === selectedShift.toUpperCase();
      return matchesSearch && matchesDept && matchesShift;
    });
  }, [records, searchQuery, selectedDept, selectedShift]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      verified: records.filter((r) => r.status === 'Verified').length,
      pending: records.filter((r) => r.status === 'Pending').length,
      discrepancy: records.filter((r) => r.api !== 'OK').length,
    };
  }, [records]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner matching AttendanceVerifyList.cshtml */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Attendance Verification</h1>
            <p className="text-xs text-slate-400">
              Department-level daily attendance audit, biometric API sync verification & bulk sign-off
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono self-start sm:self-auto">
          Area: TimeOffice / DeptVerification
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Records</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">{stats.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Verified by Dept</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{stats.verified}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Sign-off</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1 font-mono">{stats.pending}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/50 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">API Discrepancy / Late</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1 font-mono">{stats.discrepancy}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800/50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Legacy Filter Bar matching AttendanceVerifyList.cshtml: dtfrm, dept, Shift, btnShow */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Date of: dtfrm */}
          <div className="flex items-center gap-2">
            <label htmlFor="dtfrm" className="text-slate-300 font-medium">
              Date of:
            </label>
            <input
              type="date"
              id="dtfrm"
              value={dateOf}
              onChange={(e) => setDateOf(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
            />
          </div>

          {/* Department: dept */}
          <div className="flex items-center gap-2">
            <label htmlFor="dept" className="text-slate-300 font-medium">
              Department:
            </label>
            <select
              id="dept"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="ALL">ALL</option>
              {departments
                .filter((d) => d && d.toUpperCase() !== 'ALL')
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>

          {/* Shift: Shift */}
          <div className="flex items-center gap-2">
            <label htmlFor="Shift" className="text-slate-300 font-medium">
              Shift:
            </label>
            <select
              id="Shift"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="ALL">ALL</option>
              <option value="A">A</option>
              <option value="G1">G1</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          {/* Show Button: btnShow */}
          <button
            type="button"
            id="btnShow"
            onClick={handleFetchList}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-60"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Fetching...' : 'Show'}</span>
          </button>
        </div>

        {/* Search in results */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search in loaded list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table Section matching #tblatt */}
      <div className="glass-card p-5 border border-slate-800 rounded-2xl bg-slate-900/70 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
            >
              {selectedIds.size === filteredRecords.length && filteredRecords.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-600" />
              )}
              <span>Select All ({selectedIds.size}/{filteredRecords.length})</span>
            </button>
          </div>

          {/* Bottom Action buttons matching btnExl and btnVeryfy */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btnExl"
              onClick={handleExportExcel}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Excel</span>
            </button>
            <button
              type="button"
              id="btnVeryfy"
              onClick={handleBulkVerify}
              disabled={verifying || selectedIds.size === 0}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Check className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
              <span>Verify Selected ({selectedIds.size})</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[480px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-xs text-left" id="tblatt">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50 sticky top-0">
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3 font-semibold">Emp Code</th>
                <th className="py-2.5 px-3 font-semibold">Name</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold text-center">Shift</th>
                <th className="py-2.5 px-3 font-semibold text-center">In Time</th>
                <th className="py-2.5 px-3 font-semibold text-center">Out Time</th>
                <th className="py-2.5 px-3 font-semibold text-center">Wrk Hrs</th>
                <th className="py-2.5 px-3 font-semibold text-center">API</th>
                <th className="py-2.5 px-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-slate-500 font-sans">
                    No attendance records for verification on {dateOf}. Click "Show" to reload.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isChecked = selectedIds.has(r.id);
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3">
                        <button type="button" onClick={() => handleToggleSelect(r.id)}>
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-indigo-400 font-bold">{r.empCode}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-200 font-semibold">{r.name}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-400">{r.department}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {r.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-bold text-[10px]">
                          {r.shift}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-200 font-bold">{r.inTime}</td>
                      <td className="py-2.5 px-3 text-center text-slate-300">{r.outTime}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{r.workHrs}</td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.api === 'OK'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {r.api}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        {r.status === 'Verified' ? (
                          <button
                            type="button"
                            onClick={() => handleSingleVerify(r.id, false)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 hover:bg-rose-950 hover:text-rose-400 transition-colors"
                            title="Click to Un-verify"
                          >
                            <Check className="w-3 h-3" />
                            Verified
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSingleVerify(r.id, true)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-400 border border-amber-800/60 hover:bg-emerald-950 hover:text-emerald-400 transition-colors"
                            title="Click to Verify"
                          >
                            <Clock className="w-3 h-3" />
                            Verify Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

