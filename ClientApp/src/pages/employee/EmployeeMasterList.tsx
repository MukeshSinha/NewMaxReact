import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EmployeeRecord {
  empCode: string;
  cardno: string;
  empName: string;
  fatherName: string;
  subdept: string;
  dept: string;
  desig: string;
  empCategory: string;
  empType: string;
  dob: string;
  doj: string;
  leaveDate: string;
  aadhar: string;
  pan: string;
  uan: string;
  esi: string;
  contact: string;
  bankAcno: string;
  ifsc: string;
  bankName: string;
  lastPresent: string;
}

export const EmployeeMasterList: React.FC = () => {
  const [contractors, setContractors] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [filterChoice, setFilterChoice] = useState<'1' | '2'>('1'); // 1 = All Employees, 2 = Only Live
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await fetch('/api/ContractorMaster/GetContractorList');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const names = data.map((item: any) => item.itemName || item.ItemName || item.compName || item.CompName).filter(Boolean);
          if (names.length > 0) {
            setContractors(names);
            setSelectedCompany(names[0]);
            loadEmployeeData(names[0], filterChoice);
            return;
          }
        }
      }
      setContractors([]);
    } catch {
      setContractors([]);
    }
  };

  const loadEmployeeData = async (company: string, choice: string) => {
    if (!company) {
      setEmployees([]);
      return;
    }
    setIsLoading(true);
    try {
      const url = `/api/EmployeesMaster/EmployeeList?companyname=${encodeURIComponent(company)}&choice=${choice}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted: EmployeeRecord[] = data.map((d: any) => ({
            empCode: d.empCode || d.EmpCode || '',
            cardno: d.cardno || d.Cardno || '',
            empName: d.empName || d.EmpName || '',
            fatherName: d.fatherName || d.FatherName || d.FName || '',
            subdept: d.subdept || d.Subdept || d.SubDepartment || '',
            dept: d.dept || d.Department || '',
            desig: d.desig || d.Desig || '',
            empCategory: d.empCategory || d.Category || '',
            empType: d.empType || d.Etype || '',
            dob: d.dob ? (d.dob.includes('T') ? d.dob.split('T')[0] : d.dob) : '',
            doj: d.doj ? (d.doj.includes('T') ? d.doj.split('T')[0] : d.doj) : '',
            leaveDate: d.leaveDate || d.LeftDate ? (String(d.leaveDate || d.LeftDate).includes('T') ? String(d.leaveDate || d.LeftDate).split('T')[0] : String(d.leaveDate || d.LeftDate)) : '',
            aadhar: d.aadhar || d.Aadhar || '',
            pan: d.pan || d.Pan || d.PAN || '',
            uan: d.uan || d.Uan || d.UAN || '',
            esi: d.esi || d.Esi || d.ESI || '',
            contact: d.contact || d.Contact || '',
            bankAcno: d.bankAcno || d.BankAcno || '',
            ifsc: d.ifsc || d.IFSC || d.IFSCNO || '',
            bankName: d.bankName || d.BankName || '',
            lastPresent: d.lastPresent ? (String(d.lastPresent).includes('T') ? String(d.lastPresent).split('T')[0] : String(d.lastPresent)) : '',
          }));
          setEmployees(formatted);
        } else {
          setEmployees([]);
        }
      } else {
        setEmployees([]);
      }
    } catch {
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCompany(val);
    setCurrentPage(1);
    loadEmployeeData(val, filterChoice);
  };

  const handleRadioChange = (choice: '1' | '2') => {
    setFilterChoice(choice);
    setCurrentPage(1);
    loadEmployeeData(selectedCompany, choice);
  };

  const exportToExcel = () => {
    if (employees.length === 0) {
      toast.error('No employee records to export');
      return;
    }
    const headers = [
      'Code', 'CardNo', 'Name', 'F. Name', 'subDept.', 'Dept.', 'Desig.', 
      'Category', 'Etype', 'Dob', 'Doj', 'Dol', 'Aadhar', 'PAN', 'UAN', 
      'IP', 'Contact No', 'BankAcNo', 'IFSC', 'BANK', 'Last Present'
    ];

    const rows = employees.map((e) => [
      e.empCode, e.cardno, e.empName, e.fatherName, e.subdept, e.dept, e.desig,
      e.empCategory, e.empType, e.dob, e.doj, e.leaveDate, e.aadhar, e.pan, e.uan,
      e.esi, e.contact, e.bankAcno, e.ifsc, e.bankName, e.lastPresent
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((field) => `"${field}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Employees_Download_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Excel export downloaded successfully!');
  };

  const exportToPDF = () => {
    if (employees.length === 0) {
      toast.error('No employee records to export');
      return;
    }

    try {
      const doc = new jsPDF({ orientation: 'landscape' });

      // Title & Header info
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(`Employees Download Master Report - ${selectedCompany || 'All Companies'}`, 14, 15);
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Filter: ${filterChoice === '1' ? 'All Employees' : 'Only Live'}  |  Total Records: ${employees.length}  |  Generated: ${new Date().toLocaleString()}`, 14, 22);

      const columns = [
        { header: 'Code', dataKey: 'empCode' },
        { header: 'CardNo', dataKey: 'cardno' },
        { header: 'Name', dataKey: 'empName' },
        { header: 'F. Name', dataKey: 'fatherName' },
        { header: 'subDept.', dataKey: 'subdept' },
        { header: 'Dept.', dataKey: 'dept' },
        { header: 'Desig.', dataKey: 'desig' },
        { header: 'Category', dataKey: 'empCategory' },
        { header: 'Etype', dataKey: 'empType' },
        { header: 'Dob', dataKey: 'dob' },
        { header: 'Doj', dataKey: 'doj' },
        { header: 'Dol', dataKey: 'leaveDate' },
        { header: 'Aadhar', dataKey: 'aadhar' },
        { header: 'PAN', dataKey: 'pan' },
        { header: 'UAN', dataKey: 'uan' },
        { header: 'IP', dataKey: 'esi' },
        { header: 'Contact', dataKey: 'contact' },
        { header: 'BankAcNo', dataKey: 'bankAcno' },
        { header: 'IFSC', dataKey: 'ifsc' },
        { header: 'BANK', dataKey: 'bankName' },
        { header: 'Last Present', dataKey: 'lastPresent' },
      ];

      autoTable(doc, {
        startY: 26,
        head: [columns.map((c) => c.header)],
        body: employees.map((e) => columns.map((c) => (e as any)[c.dataKey] || '')),
        styles: { fontSize: 6.5, cellPadding: 1 },
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', halign: 'center' },
        theme: 'grid',
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      doc.save(`Employees_Download_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch {
      toast.error('Failed to generate PDF');
    }
  };

  // Pagination logic matching Tabulator controls in screenshot
  const totalPages = Math.ceil(employees.length / pageSize) || 1;
  const paginatedEmployees = employees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full bg-[#f4f2f7] min-h-screen text-slate-800 p-4 font-sans">
      {/* Container matching ASP.NET MVC layout */}
      <div className="max-w-[100%] mx-auto space-y-4">
        {/* Top Controls Row matching exact screenshot layout */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="w-full md:w-96 flex items-center gap-2">
            <select
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 shadow-inner"
            >
              {contractors.length === 0 ? (
                <option value="">Choose Company</option>
              ) : (
                contractors.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="filterRadio"
                checked={filterChoice === '1'}
                onChange={() => handleRadioChange('1')}
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span>All Employees</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="filterRadio"
                checked={filterChoice === '2'}
                onChange={() => handleRadioChange('2')}
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span>Only Live</span>
            </label>
          </div>
        </div>

        {/* Tabulator Style Data Grid Card matching screenshot */}
        <div className="bg-white rounded-md shadow-sm border border-slate-300 overflow-hidden">
          <div className="overflow-x-auto min-h-[420px]">
            {isLoading ? (
              <div className="py-20 text-center text-slate-500 text-xs font-medium animate-pulse">
                Loading employee master records...
              </div>
            ) : paginatedEmployees.length > 0 ? (
              <table className="w-full text-xs text-left text-slate-700 border-collapse whitespace-nowrap">
                <thead className="bg-[#e4e1eb] text-slate-800 uppercase font-bold border-b border-slate-300 sticky top-0 shadow-sm">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Code</th>
                    <th className="p-2 border-r border-slate-300">CardNo</th>
                    <th className="p-2 border-r border-slate-300">Name</th>
                    <th className="p-2 border-r border-slate-300">F. Name</th>
                    <th className="p-2 border-r border-slate-300">subDept.</th>
                    <th className="p-2 border-r border-slate-300">Dept.</th>
                    <th className="p-2 border-r border-slate-300">Desig.</th>
                    <th className="p-2 border-r border-slate-300">Category</th>
                    <th className="p-2 border-r border-slate-300">Etype</th>
                    <th className="p-2 border-r border-slate-300">Dob</th>
                    <th className="p-2 border-r border-slate-300">Doj</th>
                    <th className="p-2 border-r border-slate-300">Dol</th>
                    <th className="p-2 border-r border-slate-300">Aadhar</th>
                    <th className="p-2 border-r border-slate-300">PAN</th>
                    <th className="p-2 border-r border-slate-300">UAN</th>
                    <th className="p-2 border-r border-slate-300">IP</th>
                    <th className="p-2 border-r border-slate-300">Contact No</th>
                    <th className="p-2 border-r border-slate-300">BankAcNo</th>
                    <th className="p-2 border-r border-slate-300">IFSC</th>
                    <th className="p-2 border-r border-slate-300">BANK</th>
                    <th className="p-2">Last Present</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedEmployees.map((emp, idx) => (
                    <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f8fc]'} hover:bg-[#eae6f2] transition-colors`}>
                      <td className="p-2 font-mono border-r border-slate-200">{emp.empCode}</td>
                      <td className="p-2 font-mono border-r border-slate-200">{emp.cardno}</td>
                      <td className="p-2 font-semibold border-r border-slate-200 text-slate-900">{emp.empName}</td>
                      <td className="p-2 border-r border-slate-200">{emp.fatherName}</td>
                      <td className="p-2 border-r border-slate-200">{emp.subdept}</td>
                      <td className="p-2 border-r border-slate-200">{emp.dept}</td>
                      <td className="p-2 border-r border-slate-200">{emp.desig}</td>
                      <td className="p-2 border-r border-slate-200">{emp.empCategory}</td>
                      <td className="p-2 border-r border-slate-200">{emp.empType}</td>
                      <td className="p-2 border-r border-slate-200">{emp.dob}</td>
                      <td className="p-2 border-r border-slate-200">{emp.doj}</td>
                      <td className="p-2 border-r border-slate-200">{emp.leaveDate}</td>
                      <td className="p-2 font-mono border-r border-slate-200">{emp.aadhar}</td>
                      <td className="p-2 font-mono border-r border-slate-200">{emp.pan}</td>
                      <td className="p-2 font-mono border-r border-slate-200">{emp.uan}</td>
                      <td className="p-2 border-r border-slate-200">{emp.esi}</td>
                      <td className="p-2 font-mono border-r border-slate-200">{emp.contact}</td>
                      <td className="p-2 font-mono border-r border-slate-200">{emp.bankAcno}</td>
                      <td className="p-2 font-mono border-r border-slate-200">{emp.ifsc}</td>
                      <td className="p-2 border-r border-slate-200">{emp.bankName}</td>
                      <td className="p-2 font-mono text-slate-600">{emp.lastPresent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-24 text-center text-slate-500 text-xs font-semibold">
                No records found
              </div>
            )}
          </div>

          {/* Bottom Controls Row: Action Buttons Left + Pagination Right */}
          <div className="bg-[#e8e5ef] p-2 flex items-center justify-between border-t border-slate-300 text-xs">
            {/* Left Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportToExcel}
                className="px-3 py-1 bg-[#e0dce9] hover:bg-[#d4cedf] text-slate-800 font-semibold border border-slate-400 rounded-sm shadow-sm transition-all"
              >
                Download Excel
              </button>
              <button
                type="button"
                onClick={exportToPDF}
                className="px-3 py-1 bg-[#e0dce9] hover:bg-[#d4cedf] text-slate-800 font-semibold border border-slate-400 rounded-sm shadow-sm transition-all"
              >
                Download PDF
              </button>
            </div>

            {/* Right Pagination Buttons (First, Prev, 1, 2, 3, Next, Last) */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-50 text-[11px]"
              >
                First
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-50 text-[11px]"
              >
                Prev
              </button>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`px-2.5 py-0.5 border rounded text-[11px] font-bold ${
                    currentPage === pg
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-50 text-[11px]"
              >
                Next
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-50 text-[11px]"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
