import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Search,
  Download,
  Building2,
  Users,
  FileSpreadsheet,
  Filter,
  BarChart3,
  Clock,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { maxpayService } from '../../services/maxpayService';

interface Props {
  reportType?: string;
}

type ReportId =
  | 'ShiftWiseAttendance'
  | 'DailyDeptCategoryWiseAttendance'
  | 'DepartmentwiseApiManpower'
  | 'PeriodicApiManpower'
  | 'ShiftwisePlanVsActual'
  | 'GetMusterRoll'
  | 'DailyArrivalReport'
  | 'IndividualAttendance'
  | 'DateWiseManpower';

interface ReportConfig {
  id: ReportId;
  title: string;
  subtitle: string;
  category: string;
}

const REPORT_CONFIGS: Record<ReportId, ReportConfig> = {
  ShiftWiseAttendance: {
    id: 'ShiftWiseAttendance',
    title: 'Manpower Shiftwise',
    subtitle: 'Shift Wise Present headcount across all plant departments',
    category: 'Shift Analytics'
  },
  DailyDeptCategoryWiseAttendance: {
    id: 'DailyDeptCategoryWiseAttendance',
    title: 'Manpower Dept Wise',
    subtitle: 'Category-wise (CONT, FOT, NAPS) attendance breakdown by department',
    category: 'Department Attendance'
  },
  DepartmentwiseApiManpower: {
    id: 'DepartmentwiseApiManpower',
    title: 'Deptwise API mandays',
    subtitle: 'Daily Department present count and verified API biometric work hours',
    category: 'Biometric API'
  },
  PeriodicApiManpower: {
    id: 'PeriodicApiManpower',
    title: 'Periodic Api',
    subtitle: 'Date-range periodic manpower present and biometric hours summary',
    category: 'Biometric API'
  },
  ShiftwisePlanVsActual: {
    id: 'ShiftwisePlanVsActual',
    title: 'Planed Vs Actual (Dept)',
    subtitle: 'Shift-wise planned staffing vs actual biometric present report',
    category: 'Operational Planning'
  },
  GetMusterRoll: {
    id: 'GetMusterRoll',
    title: 'Muster Roll',
    subtitle: 'Statutory Form 16 / monthly attendance day-wise register (1-31)',
    category: 'Statutory Registers'
  },
  DailyArrivalReport: {
    id: 'DailyArrivalReport',
    title: 'Daily Arrival',
    subtitle: 'Real-time daily punch-in arrival tracking with contractor mapping',
    category: 'Arrival & Punctuality'
  },
  IndividualAttendance: {
    id: 'IndividualAttendance',
    title: 'Individual Attendance',
    subtitle: 'Employee detailed daily punch in/out, work hours, and status log',
    category: 'Employee Dossier'
  },
  DateWiseManpower: {
    id: 'DateWiseManpower',
    title: 'Dept wise Manpower',
    subtitle: 'Department-wise total strength, present, and absent statistics',
    category: 'Strength Overview'
  }
};

export const AttendanceReportHub: React.FC<Props> = ({ reportType: propReportType }) => {
  const { type: paramType } = useParams<{ type?: string }>();
  const navigate = useNavigate();

  // Active report selection state
  const initialSelected = (propReportType || paramType) as ReportId | undefined;
  const [activeReportId, setActiveReportId] = useState<ReportId | null>(
    initialSelected && REPORT_CONFIGS[initialSelected] ? initialSelected : null
  );

  // Filter criteria states (start clean without mock defaults)
  const [forDate, setForDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fromDate, setFromDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [contractorFilter, setContractorFilter] = useState<string>('ALL');
  const [contractorList, setContractorList] = useState<{ id: number; itemName: string }[]>([]);
  const [empCodeInput, setEmpCodeInput] = useState<string>('');
  const [employeeName, setEmployeeName] = useState<string>('');

  // Result dataset and status
  const [reportRows, setReportRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);

  const tableRef = useRef<HTMLTableElement | null>(null);

  // Sync prop or route changes
  useEffect(() => {
    if (propReportType && REPORT_CONFIGS[propReportType as ReportId]) {
      setActiveReportId(propReportType as ReportId);
      setReportRows([]);
      setHasExecuted(false);
    } else if (paramType && REPORT_CONFIGS[paramType as ReportId]) {
      setActiveReportId(paramType as ReportId);
      setReportRows([]);
      setHasExecuted(false);
    }
  }, [propReportType, paramType]);

  // Load contractor master list for dropdowns
  useEffect(() => {
    maxpayService.getContractorList().then((list) => {
      setContractorList(list);
    });
  }, []);

  const handleSelectReport = (reportId: ReportId) => {
    setActiveReportId(reportId);
    setReportRows([]);
    setHasExecuted(false);
    setEmployeeName('');
  };

  const handleBackToHub = () => {
    setActiveReportId(null);
    setReportRows([]);
    setHasExecuted(false);
    navigate('/timeoffice/reports');
  };

  // Execute report fetch dynamically based on active report
  const handleFetchReport = async () => {
    if (!activeReportId) return;

    if (activeReportId === 'IndividualAttendance' && !empCodeInput.trim()) {
      toast.error('Please enter an Employee Code to view attendance log.');
      return;
    }

    setLoading(true);
    setHasExecuted(true);

    try {
      let data: any[] = [];

      switch (activeReportId) {
        case 'ShiftWiseAttendance':
          data = await maxpayService.getShiftWiseAttendanceReport(forDate, categoryFilter);
          break;
        case 'DailyDeptCategoryWiseAttendance':
          data = await maxpayService.getDeptWiseCategoryWiseAttendance(forDate);
          break;
        case 'DepartmentwiseApiManpower':
          data = await maxpayService.getDepartmentwiseApi(forDate);
          break;
        case 'PeriodicApiManpower':
          data = await maxpayService.getPeriodicApiReport(fromDate, toDate);
          break;
        case 'ShiftwisePlanVsActual':
          data = await maxpayService.getPlanVsActualReport(forDate);
          break;
        case 'GetMusterRoll':
          data = await maxpayService.getMusterRollReport(fromDate, toDate);
          break;
        case 'DailyArrivalReport':
          data = await maxpayService.getDailyArrivalReport(forDate, contractorFilter);
          break;
        case 'IndividualAttendance':
          data = await maxpayService.getIndividualAttendance(empCodeInput, fromDate, toDate);
          if (data.length > 0 && data[0].empName) {
            setEmployeeName(data[0].empName);
          }
          break;
        case 'DateWiseManpower':
          data = await maxpayService.getDeptwiseManpowerByDate(forDate);
          break;
      }

      setReportRows(Array.isArray(data) ? data : []);
      if (data.length === 0) {
        toast.error('No attendance records found for the selected criteria.');
      } else {
        toast.success(`Loaded ${data.length} records.`);
      }
    } catch {
      setReportRows([]);
      toast.error('Error fetching report from server.');
    } finally {
      setLoading(false);
    }
  };

  // Export HTML Table directly to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    if (!tableRef.current || reportRows.length === 0) {
      toast.error('No data available to download.');
      return;
    }

    try {
      const activeConf = activeReportId ? REPORT_CONFIGS[activeReportId] : null;
      const sheetTitle = activeConf ? activeConf.title.replace(/[^\w]/g, '_') : 'AttendanceReport';
      const wb = XLSX.utils.table_to_book(tableRef.current, { sheet: sheetTitle });
      XLSX.writeFile(wb, `${sheetTitle}_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Excel workbook downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export Excel file.');
    }
  };

  // Render Hub Menu (Exact 4-column layout matching user screenshot)
  const renderHubMenu = () => {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Underlined Header matching user screenshot */}
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-bold text-slate-800 tracking-wide underline decoration-indigo-500 decoration-2 underline-offset-8">
            Attendance Reports
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Select a report below to open its dedicated view with live filtering, analytics, and Excel export.
          </p>
        </div>

        {/* 4-Column Layout Container matching screenshot */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1 */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSelectReport('ShiftWiseAttendance')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Manpower Shiftwise</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectReport('ShiftwisePlanVsActual')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Planed Vs Actual (Dept)</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectReport('IndividualAttendance')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Individual Attendance</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectReport('DateWiseManpower')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Dept wise Manpower</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSelectReport('DailyDeptCategoryWiseAttendance')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Manpower Dept Wise</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectReport('GetMusterRoll')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Muster Roll</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSelectReport('DepartmentwiseApiManpower')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Deptwise API mandays</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectReport('DailyArrivalReport')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Daily Arrival</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Column 4 */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSelectReport('PeriodicApiManpower')}
                className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between group"
              >
                <span>Periodic Api</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render individual report details page
  const renderReportPage = () => {
    if (!activeReportId) return null;
    const config = REPORT_CONFIGS[activeReportId];

    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Navigation & Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleBackToHub}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-all shadow-sm group"
              title="Back to Attendance Reports"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-indigo-600 font-semibold">{config.category}</span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs text-slate-500">Attendance Report</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-wide mt-0.5">{config.title}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{config.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBackToHub}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs border border-slate-200 transition-all font-medium shadow-sm"
            >
              All Reports
            </button>
          </div>
        </div>

        {/* Filter Toolbar Section */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-end gap-3 text-xs">
            {/* Report 1: Shift Wise */}
            {activeReportId === 'ShiftWiseAttendance' && (
              <>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">For Date</label>
                  <input
                    type="date"
                    value={forDate}
                    onChange={(e) => setForDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Regular">Regular</option>
                    <option value="Fot">Fot</option>
                    <option value="Toa">Toa</option>
                  </select>
                </div>
              </>
            )}

            {/* Report 2: Manpower Dept Wise */}
            {activeReportId === 'DailyDeptCategoryWiseAttendance' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">For Date</label>
                <input
                  type="date"
                  value={forDate}
                  onChange={(e) => setForDate(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}

            {/* Report 3: Deptwise API mandays */}
            {activeReportId === 'DepartmentwiseApiManpower' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">Date of:</label>
                <input
                  type="date"
                  value={forDate}
                  onChange={(e) => setForDate(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}

            {/* Report 4: Periodic Api */}
            {activeReportId === 'PeriodicApiManpower' && (
              <>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Report 5: Planed Vs Actual */}
            {activeReportId === 'ShiftwisePlanVsActual' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">For the Date:</label>
                <input
                  type="date"
                  value={forDate}
                  onChange={(e) => setForDate(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}

            {/* Report 6: Muster Roll */}
            {activeReportId === 'GetMusterRoll' && (
              <>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Report 7: Daily Arrival */}
            {activeReportId === 'DailyArrivalReport' && (
              <>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Date of:</label>
                  <input
                    type="date"
                    value={forDate}
                    onChange={(e) => setForDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Contractor</label>
                  <select
                    value={contractorFilter}
                    onChange={(e) => setContractorFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none min-w-[200px]"
                  >
                    <option value="ALL">ALL Contractors</option>
                    {contractorList.map((c) => (
                      <option key={c.id} value={c.itemName}>
                        {c.itemName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Report 8: Individual Attendance */}
            {activeReportId === 'IndividualAttendance' && (
              <>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Emp. Code</label>
                  <input
                    type="text"
                    value={empCodeInput}
                    onChange={(e) => setEmpCodeInput(e.target.value)}
                    placeholder="Enter Emp Code"
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                {employeeName && (
                  <div className="pb-2">
                    <span className="text-slate-500 text-xs">Employee: </span>
                    <span className="text-indigo-600 font-semibold text-xs">{employeeName}</span>
                  </div>
                )}
              </>
            )}

            {/* Report 9: Dept wise Manpower */}
            {activeReportId === 'DateWiseManpower' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">For Date</label>
                <input
                  type="date"
                  value={forDate}
                  onChange={(e) => setForDate(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleFetchReport}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Search className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Fetching...' : 'Show'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportExcel}
                disabled={reportRows.length === 0}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table View Area */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span>Report Data</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {reportRows.length} {reportRows.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[550px] overflow-y-auto custom-scrollbar">
            {renderReportTable()}
          </div>
        </div>
      </div>
    );
  };

  // Render table content specific to each report
  const renderReportTable = () => {
    if (!hasExecuted) {
      return (
        <div className="py-16 text-center text-slate-500 text-xs">
          Select parameters above and click <span className="text-indigo-400 font-semibold">"Show"</span> to load the report.
        </div>
      );
    }

    if (reportRows.length === 0) {
      return (
        <div className="py-16 text-center text-slate-500 text-xs">
          No records found in database for the selected criteria.
        </div>
      );
    }

    switch (activeReportId) {
      case 'ShiftWiseAttendance':
        return renderShiftWiseTable();
      case 'DailyDeptCategoryWiseAttendance':
        return renderDailyDeptCategoryTable();
      case 'DepartmentwiseApiManpower':
        return renderDeptApiTable();
      case 'PeriodicApiManpower':
        return renderPeriodicApiTable();
      case 'ShiftwisePlanVsActual':
        return renderPlanVsActualTable();
      case 'GetMusterRoll':
        return renderMusterRollTable();
      case 'DailyArrivalReport':
        return renderDailyArrivalTable();
      case 'IndividualAttendance':
        return renderIndividualAttendanceTable();
      case 'DateWiseManpower':
        return renderDateWiseManpowerTable();
      default:
        return null;
    }
  };

  // Table 1: Shift Wise Attendance
  const renderShiftWiseTable = () => {
    let totA = 0, totG = 0, totB = 0, totC = 0, totTotal = 0;
    reportRows.forEach((r) => {
      totA += Number(r.ashift || 0);
      totG += Number(r.gshift || 0);
      totB += Number(r.bshift || 0);
      totC += Number(r.cshift || 0);
      totTotal += Number(r.total || 0);
    });

    return (
      <table ref={tableRef} className="w-full text-xs text-left" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 sticky top-0">
            <th className="py-2.5 px-3 font-semibold">Department</th>
            <th className="py-2.5 px-3 font-semibold text-center">A</th>
            <th className="py-2.5 px-3 font-semibold text-center">G</th>
            <th className="py-2.5 px-3 font-semibold text-center">B</th>
            <th className="py-2.5 px-3 font-semibold text-center">C</th>
            <th className="py-2.5 px-3 font-semibold text-center text-indigo-600">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-2 px-3 font-sans text-slate-800">{row.dept}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.ashift ?? 0}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.gshift ?? 0}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.bshift ?? 0}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.cshift ?? 0}</td>
              <td className="py-2 px-3 text-center text-indigo-600 font-bold">{row.total ?? 0}</td>
            </tr>
          ))}
          {/* Summary Total Row */}
          <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
            <td className="py-2.5 px-3 font-sans text-rose-600">Total</td>
            <td className="py-2.5 px-3 text-center">{totA}</td>
            <td className="py-2.5 px-3 text-center">{totG}</td>
            <td className="py-2.5 px-3 text-center">{totB}</td>
            <td className="py-2.5 px-3 text-center">{totC}</td>
            <td className="py-2.5 px-3 text-center text-indigo-600">{totTotal}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Table 2: Category Attendance (Manpower Dept Wise)
  const renderDailyDeptCategoryTable = () => {
    let totReg = 0, totFot = 0, totToa = 0, totTotal = 0;
    reportRows.forEach((r) => {
      totReg += Number(r.regular || 0);
      totFot += Number(r.fot || 0);
      totToa += Number(r.toa || 0);
      totTotal += Number(r.total || 0);
    });

    return (
      <table ref={tableRef} className="w-full text-xs text-left" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 sticky top-0">
            <th className="py-2.5 px-3 font-semibold">Department</th>
            <th className="py-2.5 px-3 font-semibold text-center">CONT</th>
            <th className="py-2.5 px-3 font-semibold text-center">FOT</th>
            <th className="py-2.5 px-3 font-semibold text-center">NAPS</th>
            <th className="py-2.5 px-3 font-semibold text-center text-indigo-600">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-2 px-3 font-sans text-slate-800">{row.dept}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.regular ?? 0}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.fot ?? 0}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.toa ?? 0}</td>
              <td className="py-2 px-3 text-center text-indigo-600 font-bold">{row.total ?? 0}</td>
            </tr>
          ))}
          <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
            <td className="py-2.5 px-3 font-sans text-rose-600">Total</td>
            <td className="py-2.5 px-3 text-center">{totReg}</td>
            <td className="py-2.5 px-3 text-center">{totFot}</td>
            <td className="py-2.5 px-3 text-center">{totToa}</td>
            <td className="py-2.5 px-3 text-center text-indigo-600">{totTotal}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Table 3: Deptwise API mandays
  const renderDeptApiTable = () => {
    return (
      <table ref={tableRef} className="w-full text-xs text-left border-collapse" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600 bg-slate-100 text-center">
            <th rowSpan={2} className="py-2.5 px-3 font-semibold text-left border-r border-slate-200">
              Department
            </th>
            <th colSpan={2} className="py-2 px-3 font-semibold border-r border-slate-200 text-emerald-600">
              REGULAR
            </th>
            <th colSpan={2} className="py-2 px-3 font-semibold border-r border-slate-200 text-amber-600">
              FOT
            </th>
            <th colSpan={2} className="py-2 px-3 font-semibold text-cyan-600">
              TOA
            </th>
          </tr>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 text-center text-[11px]">
            <th className="py-1 px-2 border-r border-slate-200">Present</th>
            <th className="py-1 px-2 border-r border-slate-200">API Hrs</th>
            <th className="py-1 px-2 border-r border-slate-200">Present</th>
            <th className="py-1 px-2 border-r border-slate-200">API Hrs</th>
            <th className="py-1 px-2 border-r border-slate-200">Present</th>
            <th className="py-1 px-2">API Hrs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-2 px-3 font-sans text-slate-800 border-r border-slate-200">{row.dept}</td>
              <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200">{row.regular ?? 0}</td>
              <td className="py-2 px-2 text-center text-emerald-600 font-semibold border-r border-slate-200">{row.regularApi ?? 0}</td>
              <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200">{row.fot ?? 0}</td>
              <td className="py-2 px-2 text-center text-amber-600 font-semibold border-r border-slate-200">{row.fotApi ?? 0}</td>
              <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200">{row.toa ?? 0}</td>
              <td className="py-2 px-2 text-center text-cyan-600 font-semibold">{row.toaApi ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Table 4: Periodic Api
  const renderPeriodicApiTable = () => {
    let totReg = 0, totAbsReg = 0, totRegApi = 0;
    let totFot = 0, totAbsFot = 0, totFotApi = 0;
    let totToa = 0, totAbsNaps = 0, totToaApi = 0;

    reportRows.forEach((r) => {
      totReg += Number(r.regular ?? r.Regular ?? 0);
      totAbsReg += Number(r.absreg ?? r.absReg ?? 0);
      totRegApi += Number(r.regularApi ?? r.regApi ?? r.RegularApi ?? 0);

      totFot += Number(r.fot ?? r.FOT ?? 0);
      totAbsFot += Number(r.absfot ?? r.absFot ?? 0);
      totFotApi += Number(r.fotApi ?? r.FotApi ?? 0);

      totToa += Number(r.toa ?? r.TOA ?? 0);
      totAbsNaps += Number(r.absNaps ?? r.absnaps ?? r.AbsNaps ?? 0);
      totToaApi += Number(r.toaApi ?? r.ToaApi ?? 0);
    });

    return (
      <table ref={tableRef} className="w-full text-xs text-left border-collapse" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600 bg-slate-100 text-center">
            <th rowSpan={2} className="py-2.5 px-3 font-semibold text-left border-r border-slate-200">
              Department / Date
            </th>
            <th colSpan={2} className="py-2 px-3 font-semibold border-r border-slate-200 text-emerald-600">
              CONT
            </th>
            <th colSpan={2} className="py-2 px-3 font-semibold border-r border-slate-200 text-amber-600">
              FOT
            </th>
            <th colSpan={2} className="py-2 px-3 font-semibold text-cyan-600">
              NAPS
            </th>
          </tr>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 text-center text-[11px]">
            <th className="py-1 px-2 border-r border-slate-200">Present</th>
            <th className="py-1 px-2 border-r border-slate-200">API Hrs</th>
            <th className="py-1 px-2 border-r border-slate-200">Present</th>
            <th className="py-1 px-2 border-r border-slate-200">API Hrs</th>
            <th className="py-1 px-2 border-r border-slate-200">Present</th>
            <th className="py-1 px-2 border-r border-slate-800/60 text-rose-400">Absent</th>
            <th className="py-1 px-2">API Hrs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-2 px-3 font-sans text-slate-800 border-r border-slate-200">
                {row.dept || row.attDate}
              </td>
              <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200">{row.regular ?? 0}</td>
              <td className="py-2 px-2 text-center text-emerald-600 font-semibold border-r border-slate-200">{row.regularApi ?? 0}</td>
              <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200">{row.fot ?? 0}</td>
              <td className="py-2 px-2 text-center text-amber-600 font-semibold border-r border-slate-200">{row.fotApi ?? 0}</td>
              <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200">{row.toa ?? 0}</td>
              <td className="py-2 px-2 text-center text-cyan-600 font-semibold">{row.toaApi ?? 0}</td>
            </tr>
          ))}
        </tbody>
        {reportRows.length > 0 && (
          <tfoot>
            <tr className="bg-slate-900/90 font-semibold text-slate-100 border-t-2 border-slate-700">
              <td className="py-2.5 px-3 font-sans border-r border-slate-800">Total</td>
              <td className="py-2.5 px-2 text-center text-slate-200 border-r border-slate-800/40">{totReg}</td>
              <td className="py-2.5 px-2 text-center text-rose-400 border-r border-slate-800/40">{totAbsReg}</td>
              <td className="py-2.5 px-2 text-center text-emerald-400 border-r border-slate-800">{totRegApi}</td>
              <td className="py-2.5 px-2 text-center text-slate-200 border-r border-slate-800/40">{totFot}</td>
              <td className="py-2.5 px-2 text-center text-rose-400 border-r border-slate-800/40">{totAbsFot}</td>
              <td className="py-2.5 px-2 text-center text-amber-400 border-r border-slate-800">{totFotApi}</td>
              <td className="py-2.5 px-2 text-center text-slate-200 border-r border-slate-800/40">{totToa}</td>
              <td className="py-2.5 px-2 text-center text-rose-400 border-r border-slate-800/40">{totAbsNaps}</td>
              <td className="py-2.5 px-2 text-center text-cyan-400">{totToaApi}</td>
            </tr>
          </tfoot>
        )}
      </table>
    );
  };

  // Table 5: Planed Vs Actual (Dept)
  const renderPlanVsActualTable = () => {
    return (
      <table ref={tableRef} className="w-full text-xs text-left border-collapse" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600 bg-slate-100 text-center">
            <th rowSpan={2} className="py-2.5 px-3 font-semibold text-left border-r border-slate-200">
              Department
            </th>
            <th colSpan={4} className="py-2 px-2 font-semibold border-r border-slate-200 text-emerald-600">
              A Shift
            </th>
            <th colSpan={4} className="py-2 px-2 font-semibold border-r border-slate-200 text-amber-600">
              B Shift
            </th>
            <th colSpan={4} className="py-2 px-2 font-semibold text-purple-600">
              C Shift
            </th>
          </tr>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 text-center text-[10px]">
            <th className="py-1 px-1.5 border-r border-slate-200">Cont</th>
            <th className="py-1 px-1.5 border-r border-slate-200">Fot</th>
            <th className="py-1 px-1.5 border-r border-slate-200">Naps</th>
            <th className="py-1 px-1.5 border-r border-slate-200 font-bold text-slate-800">Tot</th>

            <th className="py-1 px-1.5 border-r border-slate-200">Cont</th>
            <th className="py-1 px-1.5 border-r border-slate-200">Fot</th>
            <th className="py-1 px-1.5 border-r border-slate-200">Naps</th>
            <th className="py-1 px-1.5 border-r border-slate-200 font-bold text-slate-800">Tot</th>

            <th className="py-1 px-1.5 border-r border-slate-200">Cont</th>
            <th className="py-1 px-1.5 border-r border-slate-200">Fot</th>
            <th className="py-1 px-1.5 border-r border-slate-200">Naps</th>
            <th className="py-1 px-1.5 font-bold text-slate-800">Tot</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-2 px-3 font-sans text-slate-800 border-r border-slate-200">{row.Dept}</td>

              {/* A Shift */}
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.AsftReg ?? 0} ({row.AsftRegP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.AsftFOT ?? 0} ({row.AsftFOTP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.AsftTOA ?? 0} ({row.AsftTOAP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center font-bold text-emerald-600 border-r border-slate-200">{row.AsftTot ?? 0}</td>

              {/* B Shift */}
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.BsftReg ?? 0} ({row.BsftRegP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.BsftFOT ?? 0} ({row.BsftFOTP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.BsftTOA ?? 0} ({row.BsftTOAP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center font-bold text-amber-600 border-r border-slate-200">{row.BsftTot ?? 0}</td>

              {/* C Shift */}
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.CsftReg ?? 0} ({row.CsftRegP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.CsftFOT ?? 0} ({row.CsftFOTP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center text-slate-600 border-r border-slate-200">{row.CsftTOA ?? 0} ({row.CsftTOAP ?? 0})</td>
              <td className="py-1.5 px-1.5 text-center font-bold text-purple-600">{row.CsftTot ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Table 6: Muster Roll
  const renderMusterRollTable = () => {
    return (
      <table ref={tableRef} className="w-full text-[11px] text-left border-collapse" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600 bg-slate-100 sticky top-0">
            <th className="py-2 px-2 font-semibold min-w-[70px] border-r border-slate-200">Emp Code</th>
            <th className="py-2 px-2 font-semibold min-w-[120px] border-r border-slate-200">Name</th>
            <th className="py-2 px-2 font-semibold min-w-[80px] border-r border-slate-200">Dept</th>
            <th className="py-2 px-2 font-semibold min-w-[70px] border-r border-slate-200">Category</th>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <th key={day} className="py-2 px-1 text-center font-mono border-r border-slate-200 min-w-[24px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-1.5 px-2 text-indigo-600 font-bold border-r border-slate-200">{row.empCode}</td>
              <td className="py-1.5 px-2 font-sans text-slate-800 truncate max-w-[120px] border-r border-slate-200">{row.name}</td>
              <td className="py-1.5 px-2 font-sans text-slate-500 border-r border-slate-200">{row.dept}</td>
              <td className="py-1.5 px-2 font-sans text-slate-600 border-r border-slate-200">{row.category}</td>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <td key={day} className="py-1 px-1 text-center text-[10px] border-r border-slate-200 text-slate-700">
                  {row[`dt${day}`] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Table 7: Daily Arrival
  const renderDailyArrivalTable = () => {
    return (
      <table ref={tableRef} className="w-full text-xs text-left" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 sticky top-0">
            <th className="py-2.5 px-3 font-semibold">Contractor</th>
            <th className="py-2.5 px-3 font-semibold">Emp Code</th>
            <th className="py-2.5 px-3 font-semibold">Name</th>
            <th className="py-2.5 px-3 font-semibold">Department</th>
            <th className="py-2.5 px-3 font-semibold text-center">Category</th>
            <th className="py-2.5 px-3 font-semibold text-center text-emerald-600">In Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-2 px-3 font-sans text-slate-500 truncate max-w-xs">{row.ezone || row.contractor}</td>
              <td className="py-2 px-3 text-indigo-600 font-bold">{row.empCode}</td>
              <td className="py-2 px-3 font-sans text-slate-800">{row.empName}</td>
              <td className="py-2 px-3 font-sans text-slate-600">{row.department}</td>
              <td className="py-2 px-3 text-center font-sans text-slate-500">{row.category}</td>
              <td className="py-2 px-3 text-center text-emerald-600 font-bold">{row.inTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Table 8: Individual Attendance
  const renderIndividualAttendanceTable = () => {
    return (
      <table ref={tableRef} className="w-full text-xs text-left" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 sticky top-0">
            <th className="py-2.5 px-3 font-semibold">Date</th>
            <th className="py-2.5 px-3 font-semibold">Department</th>
            <th className="py-2.5 px-3 font-semibold text-center">Shift</th>
            <th className="py-2.5 px-3 font-semibold text-center">In Time</th>
            <th className="py-2.5 px-3 font-semibold text-center">Out Time</th>
            <th className="py-2.5 px-3 font-semibold text-center">Status</th>
            <th className="py-2.5 px-3 font-semibold text-center">Work HRs</th>
            <th className="py-2.5 px-3 font-semibold text-center text-indigo-600">Api Hrs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-2 px-3 text-slate-600">
                {row.attDate ? new Date(row.attDate).toLocaleDateString('en-GB') : '-'}
              </td>
              <td className="py-2 px-3 font-sans text-slate-500">{row.department}</td>
              <td className="py-2 px-3 text-center font-sans text-slate-700">{row.shift}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.inTime || '-'}</td>
              <td className="py-2 px-3 text-center text-slate-600">{row.outTime || '-'}</td>
              <td className="py-2 px-3 text-center font-sans">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    row.attStatus === 'P'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : row.attStatus === 'W/O'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-rose-100 text-rose-700 border border-rose-300'
                  }`}
                >
                  {row.attStatus || '-'}
                </span>
              </td>
              <td className="py-2 px-3 text-center text-slate-800">{row.workHrs ?? 0}</td>
              <td className="py-2 px-3 text-center text-indigo-600 font-bold">{row.apiHrs ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Table 9: Dept wise Manpower
  const renderDateWiseManpowerTable = () => {
    return (
      <table ref={tableRef} className="w-full text-xs text-left" id="tblatt">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 sticky top-0">
            <th className="py-2.5 px-3 font-semibold">Department</th>
            <th className="py-2.5 px-3 font-semibold text-center">Total Strength</th>
            <th className="py-2.5 px-3 font-semibold text-center text-emerald-600">Present Count</th>
            <th className="py-2.5 px-3 font-semibold text-center text-rose-600">Absent Count</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {reportRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="py-2 px-3 font-sans text-slate-800">{row.department || row.dept}</td>
              <td className="py-2 px-3 text-center text-slate-700 font-bold">{row.totalStrength ?? row.total ?? 0}</td>
              <td className="py-2 px-3 text-center text-emerald-600 font-bold">{row.presentCount ?? row.present ?? 0}</td>
              <td className="py-2 px-3 text-center text-rose-600 font-bold">{row.absentCount ?? row.absent ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return activeReportId === null ? renderHubMenu() : renderReportPage();
};
