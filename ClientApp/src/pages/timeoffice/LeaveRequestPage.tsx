import React, { useState, useEffect } from 'react';
import {
  CalendarOff,
  User,
  Clock,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { maxpayService } from '../../services/maxpayService';
import {
  LeaveBalanceItem,
  RecentAttendanceItem,
  LeaveRequestData,
  Employee
} from '../../types/maxpay.types';

export const LeaveRequestPage: React.FC = () => {
  const [empCode, setEmpCode] = useState<string>('');
  const [employeeInfo, setEmployeeInfo] = useState<Employee | null>(null);

  const [leaveType, setLeaveType] = useState<string>('EL');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [days, setDays] = useState<number>(0);
  const [session, setSession] = useState<'1st Half' | '2nd Half' | 'Full Day'>('Full Day');
  const [reason, setReason] = useState<string>('');
  const [wasInformed, setWasInformed] = useState<boolean>(false);

  const [balances, setBalances] = useState<LeaveBalanceItem[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<RecentAttendanceItem[]>([]);
  const [previousRequests, setPreviousRequests] = useState<LeaveRequestData[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Auto calculate days when fromDate, toDate or session changes
  useEffect(() => {
    if (!fromDate || !toDate) {
      setDays(0);
      return;
    }
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) {
      setDays(0);
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDays(session === 'Full Day' ? diffDays : 0.5);
    }
  }, [fromDate, toDate, session]);

  // Load employee data, leave balances, recent attendance, and previous requests
  useEffect(() => {
    if (empCode.trim()) {
      loadEmployeeData(empCode);
    } else {
      setEmployeeInfo(null);
      setBalances([]);
      setRecentAttendance([]);
      setPreviousRequests([]);
    }
  }, [empCode]);

  const loadEmployeeData = async (code: string) => {
    if (!code) return;
    try {
      const [bal, att, prevReqs, empList] = await Promise.all([
        maxpayService.getLeaveBalances(code),
        maxpayService.getEmployeeRecentAttendance(code),
        maxpayService.getPreviousLeaveRequests(code),
        maxpayService.getEmployees(),
      ]);
      setBalances(bal);
      setRecentAttendance(att);
      setPreviousRequests(prevReqs);

      const found = empList.find((e) => e.empCode.toLowerCase() === code.toLowerCase());
      if (found) {
        setEmployeeInfo(found);
      } else {
        setEmployeeInfo(null);
      }
    } catch {
      // handled
    }
  };

  const handleEmpCodeBlur = () => {
    if (empCode.trim()) {
      loadEmployeeData(empCode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empCode) {
      toast.error('Please enter employee code');
      return;
    }
    if (days <= 0) {
      toast.error('Invalid date range. Upto Date must be equal to or after From Date.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please enter reason for leave');
      return;
    }

    setSubmitting(true);
    try {
      const newReq: LeaveRequestData = {
        id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
        empCode,
        leaveType,
        fromDate,
        toDate,
        days,
        session,
        reason,
        wasInformed,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };

      await maxpayService.submitLeaveRequest(newReq);
      setPreviousRequests((prev) => [newReq, ...prev]);
      toast.success(`Leave request for ${employeeInfo?.name || empCode} (${days} days) submitted successfully!`);
      setReason('');
    } catch {
      toast.error('Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setReason('');
    setLeaveType('EL');
    setSession('Full Day');
    setWasInformed(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner matching legacy LeaveRequest */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <CalendarOff className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-wide">Leave Posting & Request</h1>
            <p className="text-xs text-slate-500">
              Apply earned, casual, medical, and comp-off leaves with real-time balance tracking & attendance history
            </p>
          </div>
        </div>
        <div className="text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 font-mono self-start sm:self-auto">
          Area: TimeOffice / EmployeeLeaves
        </div>
      </div>

      {/* 3-Column Layout exactly mirroring LeaveRequest.cshtml */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Leave Request Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Leave Request Form
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
                    onBlur={handleEmpCodeBlur}
                    placeholder="Enter employee code"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => loadEmployeeData(empCode)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px]"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="EL">EL - Earned Leave</option>
                  <option value="CL">CL - Casual Leave</option>
                  <option value="SL">SL - Sick Leave</option>
                  <option value="MLA">MLA - Medical Leave</option>
                  <option value="CO">CO - Compensatory Off</option>
                </select>
              </div>

              {/* From & To Dates */}
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
                  <label className="block text-slate-700 font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Days (Read-only Auto Calculated) */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Total Days</label>
                <input
                  type="text"
                  value={days.toString()}
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-indigo-600 font-mono font-bold"
                />
              </div>

              {/* Session Radio Group */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Session</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  {(['1st Half', '2nd Half', 'Full Day'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSession(s)}
                      className={`py-1 rounded-lg text-center font-medium transition-all ${
                        session === s
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Reason for Leave</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Specify brief reason for leave..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Was Informed? Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 pt-1">
                <input
                  type="checkbox"
                  checked={wasInformed}
                  onChange={(e) => setWasInformed(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Was Informed in Advance?</span>
              </label>

              {/* Form Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Saving...' : 'Save Request'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Column 2: Leave Balance & Employee Details */}
        <div className="lg:col-span-4 space-y-4">
          {/* Leave Balance Card */}
          <div className="glass-card p-4 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <Clock3 className="w-4 h-4 text-emerald-600" />
              Leave Balance
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                    <th className="py-2 px-2.5 font-medium">Leave</th>
                    <th className="py-2 px-2 font-medium text-right">Open</th>
                    <th className="py-2 px-2 font-medium text-right">Avail</th>
                    <th className="py-2 px-2 font-medium text-right text-emerald-600">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {balances.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 font-sans text-[11px]">
                        No leave balance data available
                      </td>
                    </tr>
                  ) : (
                    balances.map((b) => (
                      <tr key={b.leaveType} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-sans text-slate-700">{b.leaveType}</td>
                        <td className="py-2 px-2 text-right text-slate-500">{b.open.toFixed(1)}</td>
                        <td className="py-2 px-2 text-right text-amber-600">{b.avail.toFixed(1)}</td>
                        <td className="py-2 px-2 text-right text-emerald-600 font-bold">{b.balance.toFixed(1)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employee Information Card */}
          <div className="glass-card p-4 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <User className="w-4 h-4 text-indigo-600" />
              Employee Information
            </h2>
            {employeeInfo ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-800 text-right">{employeeInfo.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Category:</span>
                  <span className="text-slate-700">{employeeInfo.category || 'WORKER'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-indigo-600 font-medium">{employeeInfo.department}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Contractor:</span>
                  <span className="text-slate-700 text-right">{employeeInfo.contractor}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">DOJ (Joining):</span>
                  <span className="font-mono text-slate-700">{employeeInfo.joiningDate || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DOL (Leaving):</span>
                  <span className="font-mono text-slate-400">-- (Active)</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                Enter an employee code to view details
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Recent Attendance Logs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-4 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              Recent Attendance
            </h2>

            <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 bg-slate-50 sticky top-0">
                    <th className="py-2 px-2 font-medium">Date</th>
                    <th className="py-2 px-1.5 font-medium">Sft</th>
                    <th className="py-2 px-1.5 font-medium">In</th>
                    <th className="py-2 px-1.5 font-medium">Out</th>
                    <th className="py-2 px-1.5 font-medium">Status</th>
                    <th className="py-2 px-1.5 font-medium">GP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {recentAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400 font-sans text-[11px]">
                        No recent attendance records
                      </td>
                    </tr>
                  ) : (
                    recentAttendance.map((att, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2 text-slate-700">{att.date}</td>
                      <td className="py-1.5 px-1.5 font-sans">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                          {att.shift}
                        </span>
                      </td>
                      <td className="py-1.5 px-1.5 text-slate-600">{att.inTime}</td>
                      <td className="py-1.5 px-1.5 text-slate-600">{att.outTime}</td>
                      <td className="py-1.5 px-1.5 font-sans">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            att.status === 'P'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : att.status === 'W/O'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.status}
                        </span>
                      </td>
                      <td className="py-1.5 px-1.5 text-slate-400">{att.gatepass}</td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Previous Request Table matching legacy LeaveRequest.cshtml */}
      <div className="glass-card p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <CalendarOff className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-slate-800">Previous Leave Requests</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">{previousRequests.length} Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                <th className="py-2.5 px-3 font-medium">Req ID</th>
                <th className="py-2.5 px-3 font-medium">Date Applied</th>
                <th className="py-2.5 px-3 font-medium">Leave Type</th>
                <th className="py-2.5 px-3 font-medium">From Date</th>
                <th className="py-2.5 px-3 font-medium">To Date</th>
                <th className="py-2.5 px-3 font-medium text-center">Days</th>
                <th className="py-2.5 px-3 font-medium">Reason</th>
                <th className="py-2.5 px-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {previousRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-400 font-sans">
                    No previous leave requests found for this employee.
                  </td>
                </tr>
              ) : (
                previousRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-indigo-600 font-semibold">{req.id}</td>
                    <td className="py-2 px-3 text-slate-700">{req.appliedDate}</td>
                    <td className="py-2 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-[11px]">
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-700">{req.fromDate}</td>
                    <td className="py-2 px-3 text-slate-700">{req.toDate}</td>
                    <td className="py-2 px-3 text-center text-slate-800 font-bold">{req.days}</td>
                    <td className="py-2 px-3 font-sans text-slate-700 max-w-xs truncate">{req.reason}</td>
                    <td className="py-2 px-3 text-center font-sans">
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
                          <Clock3 className="w-3 h-3" />
                        )}
                        {req.status}
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
  );
};

