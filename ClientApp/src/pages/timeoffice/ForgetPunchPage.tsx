import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  Save,
  RotateCcw,
  Check,
  X,
  User,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { maxpayService } from '../../services/maxpayService';
import { ForgetPunchRecord } from '../../types/maxpay.types';

export const ForgetPunchPage: React.FC = () => {
  const [records, setRecords] = useState<ForgetPunchRecord[]>([]);
  const [empCode, setEmpCode] = useState<string>('');
  const [empName, setEmpName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [punchType, setPunchType] = useState<'In' | 'Out' | 'Both'>('Out');
  const [actualTime, setActualTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const list = await maxpayService.getForgetPunchRecords();
    setRecords(list);
  };

  const handleLookupEmp = async () => {
    if (!empCode) return;
    const employees = await maxpayService.getEmployees();
    const found = employees.find((e) => e.empCode.toLowerCase() === empCode.toLowerCase());
    if (found) {
      setEmpName(found.name);
      setDepartment(found.department);
      toast.success(`Loaded details for ${found.name}`);
    } else {
      toast.error(`Employee ${empCode} not found`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empCode || !empName) {
      toast.error('Please enter a valid employee code');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please explain why biometric swipe was missed');
      return;
    }

    setSubmitting(true);
    try {
      const newRecord: ForgetPunchRecord = {
        id: `FP-${Math.floor(200 + Math.random() * 800)}`,
        empCode,
        empName,
        department,
        date,
        punchType,
        actualTime,
        reason,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
      };

      await maxpayService.submitForgetPunch(newRecord);
      setRecords((prev) => [newRecord, ...prev]);
      toast.success(`Forget Punch request for ${empName} submitted for verification!`);
      setReason('');
    } catch {
      toast.error('Failed to submit punch regularization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRecords((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, verifiedBy: 'TIME_OFFICE_ADMIN' } : item
      )
    );
    toast.success(`Punch Regularization ${id} marked as ${newStatus}`);
  };

  const filteredRecords = useMemo(() => {
    return records.filter(
      (r) =>
        r.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      approved: records.filter((r) => r.status === 'Approved').length,
      pending: records.filter((r) => r.status === 'Pending').length,
    };
  }, [records]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-600/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-wide">Forget Punch Regularization</h1>
            <p className="text-xs text-slate-500">
              Submit and verify missing biometric punches, failed device scans, and manual punch entries
            </p>
          </div>
        </div>
        <div className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-mono self-start sm:self-auto">
          Area: TimeOffice / ForgetPunch
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Regularizations</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1 font-mono">{stats.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Regularized & Approved</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1 font-mono">{stats.approved}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Dept Approvals</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1 font-mono">{stats.pending}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Regularization Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
              <Clock className="w-4 h-4 text-indigo-600" />
              Regularization Request
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
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleLookupEmp}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px]"
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
                  <span className="text-indigo-600 font-medium">{department || '-'}</span>
                </div>
              </div>

              {/* Date of Missed Punch */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Date of Missed Punch</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Missing Punch Type */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Missing Punch Type</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  {(['In', 'Out', 'Both'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPunchType(t)}
                      className={`py-1 rounded-lg text-center font-medium transition-all ${
                        punchType === t
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {t} Punch
                    </button>
                  ))}
                </div>
              </div>

              {/* Actual Time */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Actual Punch Time (Estimated)</label>
                <input
                  type="text"
                  value={actualTime}
                  onChange={(e) => setActualTime(e.target.value)}
                  placeholder="e.g. 08:30 or 17:15"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Reason for Missing Punch</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why punch was missed (e.g. Biometric scanner unreadable, card forgotten at home, urgent plant emergency)..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Regularization'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReason('')}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Regularization Log & Approvals */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-semibold text-slate-800">Forget Punch History & Department Verification</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono border border-amber-200">
                  {filteredRecords.length} Entries
                </span>
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                    <th className="py-2.5 px-3 font-medium">Req ID</th>
                    <th className="py-2.5 px-3 font-medium">Employee</th>
                    <th className="py-2.5 px-3 font-medium">Missed Date & Type</th>
                    <th className="py-2.5 px-3 font-medium">Actual Time</th>
                    <th className="py-2.5 px-3 font-medium">Reason</th>
                    <th className="py-2.5 px-3 font-medium text-center">Status</th>
                    <th className="py-2.5 px-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 font-sans">
                        No forget punch records match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-amber-600 font-semibold">{r.id}</td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-medium text-slate-800">{r.empName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {r.empCode} • {r.department}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-mono text-slate-700">{r.date}</div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px]">
                            {r.punchType} Punch
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-800 font-bold">{r.actualTime}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-700 max-w-xs truncate">
                          {r.reason}
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              r.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : r.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {r.status === 'Approved' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : r.status === 'Rejected' ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          {r.status === 'Pending' ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(r.id, 'Approved')}
                                title="Approve Regularization"
                                className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                                title="Reject Regularization"
                                className="p-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">{r.verifiedBy || 'VERIFIED'}</span>
                          )}
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
