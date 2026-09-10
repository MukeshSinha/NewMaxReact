import React, { useState, useEffect } from 'react';
import { Contact, Loader2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { maxpayService } from '../../services/maxpayService';

interface EmployeeItem {
  empCode: string;
  empName: string;
}

export const PunchProcessPage: React.FC = () => {
  const [contractors, setContractors] = useState<{ id: number; itemName: string }[]>([]);
  const [selectedContractorName, setSelectedContractorName] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [uptoDate, setUptoDate] = useState<string>('');
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [selectedEmpCodes, setSelectedEmpCodes] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState<'all' | 'none'>('all');
  const [searchEmpCode, setSearchEmpCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    try {
      const list = await maxpayService.getContractorList();
      setContractors(list);
      if (list.length > 0) {
        setSelectedContractorName(list[0].itemName);
      }
    } catch {
      setContractors([]);
    }
  };

  const handleShowEmployees = async () => {
    if (!fromDate || !uptoDate) {
      toast.error('Please select both From Date and Upto Date.');
      return;
    }

    setLoading(true);
    try {
      const data = await maxpayService.getEmployeeListBetweenDate(
        selectedContractorName,
        fromDate,
        uptoDate,
        1
      );
      setEmployees(data);
      if (data.length > 0) {
        setSelectedEmpCodes(new Set(data.map((e) => e.empCode)));
        setSelectMode('all');
        toast.success(`Loaded ${data.length} employees.`);
      } else {
        setSelectedEmpCodes(new Set());
        toast.error('No employees found for the selected company and dates.');
      }
    } catch {
      toast.error('Failed to load employee list from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelectAll = (mode: 'all' | 'none') => {
    setSelectMode(mode);
    if (mode === 'all') {
      setSelectedEmpCodes(new Set(employees.map((e) => e.empCode)));
    } else {
      setSelectedEmpCodes(new Set());
    }
  };

  const handleToggleEmp = (empCode: string) => {
    setSelectedEmpCodes((prev) => {
      const next = new Set(prev);
      if (next.has(empCode)) {
        next.delete(empCode);
      } else {
        next.add(empCode);
      }
      return next;
    });
    setSelectMode('none');
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = searchEmpCode.trim().toLowerCase();
    if (!term) return true;
    return (
      (emp.empCode && emp.empCode.toLowerCase().includes(term)) ||
      (emp.empName && emp.empName.toLowerCase().includes(term))
    );
  });

  const handleFindEmp = () => {
    const term = searchEmpCode.trim().toLowerCase();
    if (!term) return;

    const matches = employees.filter(
      (emp) =>
        (emp.empCode && emp.empCode.toLowerCase().includes(term)) ||
        (emp.empName && emp.empName.toLowerCase().includes(term))
    );

    if (matches.length > 0) {
      setSelectedEmpCodes((prev) => {
        const next = new Set(prev);
        matches.forEach((emp) => next.add(emp.empCode));
        return next;
      });
      toast.success(`Selected ${matches.length} matching employee${matches.length > 1 ? 's' : ''}.`);
    } else {
      toast.error(`No employee found matching "${searchEmpCode}" in loaded list.`);
    }
  };

  const handleFindEmpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFindEmp();
    }
  };

  const handleRunProcess = async () => {
    if (selectedEmpCodes.size === 0) {
      toast.error('Please select at least one employee from the list.');
      return;
    }
    if (!fromDate || !uptoDate) {
      toast.error('Please specify both From Date and Upto Date.');
      return;
    }

    setProcessing(true);
    try {
      await maxpayService.processPunches({
        empCodes: Array.from(selectedEmpCodes),
        fromDate,
        uptoDate,
      });
      toast.success(
        `Attendance Process successfully completed for ${selectedEmpCodes.size} employees!`
      );
    } catch {
      toast.error('An error occurred during attendance processing.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="py-6 px-4">
      {/* Centered Form Card Matching Legacy Screenshot */}
      <div className="w-full max-w-[620px] mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        
        {/* Header with Purple Icon and Title */}
        <div className="flex items-center gap-3 pb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 shadow-md flex items-center justify-center text-white">
            <Contact className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Attendance Process
          </h2>
        </div>

        {/* Select Company */}
        <div className="space-y-1.5 mb-4">
          <label htmlFor="companySelect" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Company
          </label>
          <select
            id="companySelect"
            value={selectedContractorName}
            onChange={(e) => setSelectedContractorName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          >
            {contractors.length === 0 ? (
              <option value="">Loading Companies...</option>
            ) : (
              contractors.map((c) => (
                <option key={c.id} value={c.itemName}>
                  {c.itemName}
                </option>
              ))
            )}
          </select>
        </div>

        {/* From Date and Upto Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1.5">
            <label htmlFor="fromDate" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="uptoDate" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Upto Date
            </label>
            <input
              type="date"
              id="uptoDate"
              value={uptoDate}
              onChange={(e) => setUptoDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Blue Show Button */}
        <button
          type="button"
          id="showButton"
          onClick={handleShowEmployees}
          disabled={loading}
          className="w-full bg-[#007bff] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center justify-center gap-2 mb-5 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>Show</span>
          )}
        </button>

        {/* Radio Selection: All vs Selected */}
        <div className="flex items-center gap-8 mb-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="selectOption"
              id="selectAll"
              value="all"
              checked={selectMode === 'all'}
              onChange={() => handleToggleSelectAll('all')}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">All</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="selectOption"
              id="selectNone"
              value="none"
              checked={selectMode === 'none'}
              onChange={() => handleToggleSelectAll('none')}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Selected</span>
          </label>
        </div>

        {/* Find Employee by Code or Name */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="findEmpCode" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Find Employee by Code or Name
            </label>
            {searchEmpCode && (
              <span className="text-[11px] text-indigo-500 font-medium font-mono">
                {filteredEmployees.length} match{filteredEmployees.length === 1 ? '' : 'es'} found
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              id="findEmpCode"
              placeholder="Search by Employee Code or Name (e.g. 101 or Ramesh)..."
              value={searchEmpCode}
              onChange={(e) => setSearchEmpCode(e.target.value)}
              onKeyDown={handleFindEmpKeyDown}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-9 pr-24 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              {searchEmpCode && (
                <button
                  type="button"
                  onClick={() => setSearchEmpCode('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  title="Clear filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleFindEmp}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors"
                title="Select matching employees"
              >
                Select
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            List filters live as you type. Click "Select" or press Enter to add matches to selection.
          </p>
        </div>

        {/* Select Items: Dynamic Checkbox List */}
        <div className="space-y-1.5 mb-6">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Items
            </label>
            {employees.length > 0 && (
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400 font-mono">
                  {selectedEmpCodes.size} of {employees.length} selected
                </span>
                {searchEmpCode.trim() && (
                  <>
                    <span className="text-slate-500">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEmpCodes((prev) => {
                          const next = new Set(prev);
                          filteredEmployees.forEach((e) => next.add(e.empCode));
                          return next;
                        });
                        toast.success(`Selected ${filteredEmployees.length} matching employees.`);
                      }}
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Select all filtered
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <div
            id="checkboxList"
            className="checkbox-list w-full min-h-[140px] max-h-[180px] overflow-y-auto rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 space-y-1.5 shadow-inner"
          >
            {employees.length === 0 ? (
              <div className="h-[120px] flex items-center justify-center text-xs text-slate-400 text-center px-4">
                Select dates above and click "Show" to load employees.
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="h-[120px] flex flex-col items-center justify-center text-xs text-slate-400 text-center px-4">
                <span>No employees match "{searchEmpCode}".</span>
                <button
                  type="button"
                  onClick={() => setSearchEmpCode('')}
                  className="mt-1 text-blue-500 hover:underline text-xs"
                >
                  Clear search filter
                </button>
              </div>
            ) : (
              filteredEmployees.map((emp) => {
                const isChecked = selectedEmpCodes.has(emp.empCode);
                return (
                  <div
                    key={emp.empCode}
                    className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`emp_${emp.empCode}`}
                      value={emp.empCode}
                      checked={isChecked}
                      onChange={() => handleToggleEmp(emp.empCode)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`emp_${emp.empCode}`}
                      className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none font-mono"
                    >
                      <span className="font-bold text-indigo-500">{emp.empCode}</span>: {emp.empName}
                    </label>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Green Attendance Process Button */}
        <button
          type="button"
          id="submitChecked"
          onClick={handleRunProcess}
          disabled={processing || selectedEmpCodes.size === 0}
          className="w-full bg-[#28a745] hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Attendance...</span>
            </>
          ) : (
            <span>Attendance Process</span>
          )}
        </button>
      </div>
    </div>
  );
};
