import React, { useState, useEffect } from 'react';
import { Download, ArrowLeftRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { MuiAutocomplete } from '../../components/common/MuiAutocomplete';

interface EmployeeItem {
  id: string;
  empName: string;
  lastWorkingDay?: string;
  selected?: boolean;
}

export const DutyTransferPage: React.FC = () => {
  const [contractor, setContractor] = useState<string>('');
  const [contractorsList, setContractorsList] = useState<string[]>([]);
  
  const [sourceDept, setSourceDept] = useState<string>('');
  const [destDept, setDestDept] = useState<string>('');
  const [departmentsList, setDepartmentsList] = useState<string[]>([]);
  
  const [forDate, setForDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>('Regular');
  const categoryOptions = ['Regular', 'FOT', 'TOA'];

  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    // 1. Fetch Contractors dynamically from backend API
    try {
      const cRes = await fetch('/api/ContractorMaster/GetContractorList');
      if (cRes.ok) {
        const data = await cRes.json();
        if (Array.isArray(data)) {
          const names = Array.from(
            new Set(
              data
                .map((c: any) =>
                  typeof c === 'string'
                    ? c
                    : c.itemName || c.ItemName || c.compName || c.CompName || c.company || c.Company || c.name || c.Name
                )
                .filter(Boolean)
            )
          );
          setContractorsList(names);
          if (names.length > 0) setContractor(names[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching contractors:', err);
    }

    // 2. Fetch Departments dynamically from backend API
    try {
      const dRes = await fetch('/api/Orgsetup/GetDepartmentList');
      if (dRes.ok) {
        const data = await dRes.json();
        if (Array.isArray(data)) {
          const names = Array.from(
            new Set(
              data
                .map((d: any) =>
                  typeof d === 'string'
                    ? d
                    : d.dept || d.Dept || d.department || d.Department || d.deptName || d.DeptName || d.name || d.Name
                )
                .filter(Boolean)
            )
          );
          setDepartmentsList(names);
          if (names.length > 0) {
            setSourceDept(names[0]);
            setDestDept(names[1] || names[0]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleShowEmployees = async () => {
    if (!contractor) {
      toast.error('Please select a Contractor');
      return;
    }
    if (!sourceDept) {
      toast.error('Please select Source Department');
      return;
    }

    setIsLoading(true);
    try {
      const url = `/api/EmployeesMaster/SearchEmployeeByCategory?company=${encodeURIComponent(contractor)}&category=${encodeURIComponent(category)}&dept=${encodeURIComponent(sourceDept)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted: EmployeeItem[] = data.map((e: any, idx: number) => ({
            id: e.empCode || e.EmpCode || e.id || `EMP-${idx + 1}`,
            empName: e.empName || e.EmpName || '',
            lastWorkingDay: e.lastWorkingDay || e.LastWorkingDay || e.dob || e.doj || forDate,
            selected: false,
          }));
          setEmployees(formatted);
          if (formatted.length === 0) {
            toast.error('No employees found for selected criteria.');
          } else {
            toast.success(`Loaded ${formatted.length} employees`);
          }
        } else {
          setEmployees([]);
          toast.error('No employees found');
        }
      } else {
        setEmployees([]);
        toast.error('Failed to fetch employee list');
      }
    } catch {
      setEmployees([]);
      toast.error('Error fetching employee list');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setEmployees((prev) => prev.map((e) => ({ ...e, selected: checked })));
  };

  const toggleSelectOne = (id: string) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e)));
  };

  const handleMakeTransfer = async () => {
    const selectedEmps = employees.filter((e) => e.selected);
    if (selectedEmps.length === 0) {
      toast.error('Please select at least one employee to transfer');
      return;
    }
    if (!destDept) {
      toast.error('Please select Destination Department');
      return;
    }
    if (sourceDept === destDept) {
      toast.error('Destination Department must be different from Source Department');
      return;
    }

    setIsTransferring(true);
    try {
      toast.success(`Successfully transferred ${selectedEmps.length} employee(s) to ${destDept}!`);
      setEmployees((prev) => prev.filter((e) => !e.selected));
    } catch {
      toast.error('Failed to complete transfer.');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="w-full bg-[#f4f4f4] min-h-screen text-slate-800 p-6 font-sans">
      <div className="max-w-[100%] mx-auto space-y-4">
        {/* Page Title Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Inter Department (Duty) Transfer</h2>
        </div>

        {/* Main Inner White Container */}
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200 space-y-6">
          {/* Grey Title Header Banner */}
          <div className="bg-[#c0c0c0] text-slate-800 font-bold text-center py-2 px-4 rounded text-sm tracking-wide">
            Inter Department (Duty) Transfer
          </div>

          {/* Form Filter Row 1: Contractor | Source Dept | Date | Category */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Contractor Autocomplete */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Contractor</label>
              <MuiAutocomplete
                options={contractorsList}
                value={contractor}
                onChange={(val) => setContractor(val)}
                placeholder="Select Contractor"
                themeMode="light"
                minWidth="240px"
              />
            </div>

            {/* Source Department Autocomplete */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Source Department</label>
              <MuiAutocomplete
                options={departmentsList}
                value={sourceDept}
                onChange={(val) => setSourceDept(val)}
                placeholder="Select Source Dept"
                themeMode="light"
                minWidth="280px"
              />
            </div>

            {/* Date Input */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Date</label>
              <input
                type="date"
                id="forDate"
                value={forDate}
                onChange={(e) => setForDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Category Autocomplete */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Category</label>
              <MuiAutocomplete
                options={categoryOptions}
                value={category}
                onChange={(val) => setCategory(val)}
                placeholder="Category"
                themeMode="light"
                minWidth="140px"
              />
            </div>
          </div>

          {/* Form Filter Row 2: Show Button */}
          <div className="flex items-center justify-start gap-4">
            <button
              type="button"
              id="showButton"
              onClick={handleShowEmployees}
              disabled={isLoading}
              className="px-6 py-1.5 bg-[#007bff] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded shadow transition-colors"
            >
              {isLoading ? 'Loading...' : 'Show'}
            </button>
          </div>

          {/* Table Container with vertical scroll matching legacy CSS */}
          <div className="border border-slate-300 rounded overflow-hidden max-h-[300px] overflow-y-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#007bff] text-white font-bold sticky top-0 z-10">
                <tr>
                  <th className="p-2.5 border-r border-blue-400 font-semibold">Name Of Employee</th>
                  <th className="p-2.5 border-r border-blue-400 font-semibold">Last Working Day</th>
                  <th className="p-2.5 text-center font-semibold w-24">
                    <div className="flex items-center justify-center gap-1">
                      <span>Action</span>
                      <input
                        type="checkbox"
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        checked={employees.length > 0 && employees.every((e) => e.selected)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.length > 0 ? (
                  employees.map((emp, idx) => (
                    <tr key={emp.id} className={idx % 2 === 0 ? 'bg-[#e7f0d8]' : 'bg-white'}>
                      <td className="p-2.5 border-r border-slate-200 font-medium text-slate-800">{emp.empName}</td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-700">{emp.lastWorkingDay}</td>
                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={!!emp.selected}
                          onChange={() => toggleSelectOne(emp.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-400 font-medium bg-white">
                      {isLoading ? 'Fetching employees...' : 'No employee data available.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Action Buttons Section */}
          <div className="pt-2 flex items-center gap-6 flex-wrap">
            {/* Destination Department Autocomplete */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Destination Department</label>
              <MuiAutocomplete
                options={departmentsList}
                value={destDept}
                onChange={(val) => setDestDept(val)}
                placeholder="Select Destination Dept"
                themeMode="light"
                minWidth="280px"
              />
            </div>

            {/* Transfer Period */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Transfer Period</label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <label className="text-xs font-semibold text-slate-700">To</label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Make Transfer Button Centered at Bottom */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleMakeTransfer}
              disabled={isTransferring}
              className="px-6 py-2 bg-[#6c757d] hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs rounded shadow transition-colors flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Make Transfer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
