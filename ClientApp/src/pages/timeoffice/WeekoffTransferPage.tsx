import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeftRight,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Save,
  RotateCcw,
  Check,
  X,
  Building2,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { maxpayService } from '../../services/maxpayService';
import { WeekoffTransferRecord } from '../../types/maxpay.types';

export const WeekoffTransferPage: React.FC = () => {
  const [transfers, setTransfers] = useState<WeekoffTransferRecord[]>([]);
  const [empCode, setEmpCode] = useState<string>('');
  const [empName, setEmpName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [contractor, setContractor] = useState<string>('');
  const [currentWeekoff, setCurrentWeekoff] = useState<string>('Sunday');
  const [requestedWeekoff, setRequestedWeekoff] = useState<string>('Monday');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = async () => {
    const list = await maxpayService.getWeekoffTransfers();
    setTransfers(list);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empCode || !empName) {
      toast.error('Please enter a valid employee code');
      return;
    }
    if (currentWeekoff === requestedWeekoff) {
      toast.error('Requested weekoff must be different from current weekoff');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for weekoff transfer');
      return;
    }

    setSubmitting(true);
    try {
      const newRecord: WeekoffTransferRecord = {
        id: `WO-${Math.floor(8000 + Math.random() * 1999)}`,
        empCode,
        empName,
        department,
        contractor,
        currentWeekoff,
        requestedWeekoff,
        fromDate,
        toDate,
        reason,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
      };

      await maxpayService.submitWeekoffTransfer(newRecord);
      setTransfers((prev) => [newRecord, ...prev]);
      toast.success(`Weekoff transfer request for ${empName} submitted successfully!`);
      setReason('');
    } catch {
      toast.error('Failed to submit transfer request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setTransfers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    toast.success(`Request ${id} marked as ${newStatus}`);
  };

  const filteredTransfers = useMemo(() => {
    return transfers.filter(
      (t) =>
        t.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transfers, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: transfers.length,
      approved: transfers.filter((t) => t.status === 'Approved').length,
      pending: transfers.filter((t) => t.status === 'Pending').length,
    };
  }, [transfers]);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Weekoff Transfer</h1>
            <p className="text-xs text-slate-500">
              Shift designated weekly off days for scheduled plant maintenance, holiday coverage, and overtime roster
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-mono self-start sm:self-auto">
          Area: TimeOffice / WeekoffTransfer
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Transfer Requests</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1 font-mono">{stats.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Approved Transfers</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1 font-mono">{stats.approved}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1 font-mono">{stats.pending}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Request Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Transfer Application
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {/* Emp Code with lookup */}
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
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-medium"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              {/* Employee Info display */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Name:</span>
                  <span className="text-slate-800 font-medium">{empName || '-'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Dept:</span>
                  <span className="text-indigo-600 font-semibold">{department || '-'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Contractor:</span>
                  <span className="text-slate-700 truncate max-w-[170px]">{contractor || '-'}</span>
                </div>
              </div>

              {/* Current and Requested Weekoff */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Current Weekoff</label>
                  <select
                    value={currentWeekoff}
                    onChange={(e) => setCurrentWeekoff(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Requested Weekoff</label>
                  <select
                    value={requestedWeekoff}
                    onChange={(e) => setRequestedWeekoff(e.target.value)}
                    className="w-full bg-white border border-indigo-500 rounded-xl px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none font-medium"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Effective Date Range */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Upto Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Reason for Transfer</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State reason (e.g., Weekend shutdown maintenance, machine audit coverage)..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Apply Transfer'}</span>
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

        {/* Right: Transfer Records & History */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-semibold text-slate-800">Transfer Requests & Approvals</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono border border-indigo-200">
                  {filteredTransfers.length} Records
                </span>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by code, name, dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">Req ID</th>
                    <th className="py-2.5 px-3 font-semibold">Employee</th>
                    <th className="py-2.5 px-3 font-semibold">Transfer Shift</th>
                    <th className="py-2.5 px-3 font-semibold">Effective Period</th>
                    <th className="py-2.5 px-3 font-semibold">Reason</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 font-sans">
                        No weekoff transfer requests match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTransfers.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 text-indigo-600 font-semibold">{req.id}</td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-medium text-slate-800">{req.empName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {req.empCode} • {req.department}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
                              {req.currentWeekoff}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-[10px]">
                              {req.requestedWeekoff}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          {req.fromDate} <span className="text-slate-400">to</span> {req.toDate}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-600 max-w-xs truncate">
                          {req.reason}
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              req.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : req.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {req.status === 'Approved' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : req.status === 'Rejected' ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {req.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          {req.status === 'Pending' ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(req.id, 'Approved')}
                                title="Approve"
                                className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                                title="Reject"
                                className="p-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Completed</span>
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
