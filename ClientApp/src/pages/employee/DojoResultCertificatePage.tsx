import React, { useState, useEffect } from 'react';
import { Calendar, Search, Printer, Award, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

interface DojoResultRecord {
  empCode: string;
  empName: string;
  fatherName: string;
  doj: string;
  ezn: string; // Contractor Name
  sts: string; // Result status / % of Marks
  marks: string; // Marks / Result
  createOn?: string;
  allocateDate?: string;
  contact?: string;
}

export const DojoResultCertificatePage: React.FC = () => {
  const [dojDate, setDojDate] = useState<string>('2026-08-01');
  const [results, setResults] = useState<DojoResultRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDojoResults(dojDate);
  }, []);

  const fetchDojoResults = async (dateVal: string) => {
    if (!dateVal) {
      toast.error('Please select a Date of Join');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/TempJoin/getDojoResultList?Doj=${encodeURIComponent(dateVal)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted: DojoResultRecord[] = data.map((d: any) => ({
            empCode: d.empCode || d.EmpCode || d.tmpCode || '',
            empName: d.empName || d.EmpName || '',
            fatherName: d.fatherName || d.FatherName || d.fName || '',
            doj: d.doj ? (d.doj.includes('T') ? d.doj.split('T')[0] : d.doj) : dateVal,
            ezn: d.ezn || d.Ezn || d.contractorName || d.CompName || '',
            sts: d.sts || d.Sts || d.status || 'Pass',
            marks: d.marks || d.Marks || d.score || '60',
            createOn: d.createOn ? (d.createOn.includes('T') ? d.createOn.split('T')[0] : d.createOn) : dateVal,
            allocateDate: d.allocateDate ? (d.allocateDate.includes('T') ? d.allocateDate.split('T')[0] : d.allocateDate) : dateVal,
            contact: d.contact || d.Contact || '',
          }));
          setResults(formatted);
          if (formatted.length === 0) {
            toast.error('No records found for selected date.');
          }
        } else {
          setResults([]);
          toast.error('No records found for selected date.');
        }
      } else {
        setResults([]);
        toast.error('Failed to load Dojo results.');
      }
    } catch {
      setResults([]);
      toast.error('Error fetching Dojo results.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCertificatePDF = (recordsToPrint: DojoResultRecord[]) => {
    if (!recordsToPrint || recordsToPrint.length === 0) {
      toast.error('No records to print certificate.');
      return;
    }

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      recordsToPrint.forEach((rec, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Title Header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('SHRIRAM PISTONS : GHAZIABAD', 105, 20, { align: 'center' });

        doc.setFontSize(13);
        doc.text('DOJO CENTER', 105, 28, { align: 'center' });

        doc.setFontSize(11);
        doc.text('New Joinee Associates - Handover Slip', 105, 35, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Sr. No : ${index + 1}`, 180, 42, { align: 'right' });

        // Divider Line
        doc.setLineWidth(0.5);
        doc.setDrawColor(203, 213, 225);
        doc.line(15, 45, 195, 45);

        // Certificate Box
        doc.rect(15, 52, 180, 115);

        let y = 62;
        // Row 1: Name & Code
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name : ${rec.empName}`, 20, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`Code : ${rec.empCode}`, 185, y, { align: 'right' });
        doc.line(15, y + 4, 195, y + 4);

        // Row 2: Mobile No.
        y += 12;
        doc.setFont('helvetica', 'normal');
        doc.text(`Mobile No. : ${rec.contact || '-'}`, 20, y);
        doc.line(15, y + 4, 195, y + 4);

        // Row 3: Contractor Name
        y += 12;
        doc.text(`Contractor Name : ${rec.ezn || '-'}`, 20, y);
        doc.line(15, y + 4, 195, y + 4);

        // Row 4: DOJO & Safety Training Header
        y += 12;
        doc.setFont('helvetica', 'bold');
        doc.text('DOJO & Safety Training', 20, y);
        doc.line(15, y + 4, 195, y + 4);

        // Row 5: Start Date & End Date
        y += 12;
        doc.setFont('helvetica', 'normal');
        doc.text(`Start Date : ${rec.doj}      End Date : ${rec.createOn || rec.doj}`, 20, y);
        doc.line(15, y + 4, 195, y + 4);

        // Row 6: Written Test & Pass Marks
        y += 12;
        doc.text(`Written Test : ${rec.sts || 'Pass'}     Pass Marks (%) : ${rec.marks || '-'}`, 20, y);
        doc.line(15, y + 4, 195, y + 4);

        // Row 7: Date of Allocation
        y += 12;
        doc.text(`Date of Allocation in Dept / Plant : ${rec.allocateDate || rec.doj}`, 20, y);

        // Footnotes
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text('Note :- Safety Training has been given by the safety department.', 105, 180, { align: 'center' });
        doc.text('This is a computer generated certificate hence signature not required.', 105, 190, { align: 'center' });
      });

      doc.save(`Dojo_Certificate_${dojDate}.pdf`);
      toast.success('Dojo Certificate PDF generated successfully!');
    } catch (err) {
      toast.error('Failed to generate Certificate PDF');
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-[#f4f2f7] min-h-screen text-slate-800 p-6 font-sans">
      <div className="max-w-[100%] mx-auto space-y-6">
        {/* Page Title Header matching legacy screenshot */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Dojo Result</h2>
        </div>

        {/* Date Filter Bar matching legacy screenshot */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200 flex items-center gap-4 flex-wrap">
          <label htmlFor="dtfrm" className="text-xs font-semibold text-slate-700">
            Date of Join:
          </label>
          <input
            type="date"
            id="dtfrm"
            value={dojDate}
            onChange={(e) => setDojDate(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-800"
          />
          <button
            type="button"
            onClick={() => fetchDojoResults(dojDate)}
            disabled={isLoading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded shadow transition-colors"
          >
            {isLoading ? 'Loading...' : 'Show'}
          </button>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-md shadow-sm border border-slate-300 overflow-hidden">
          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead className="bg-[#f4f4f4] text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-3 border-r border-slate-300 font-semibold">Emp Code</th>
                  <th className="p-3 border-r border-slate-300 text-center font-semibold">Name</th>
                  <th className="p-3 border-r border-slate-300 text-center font-semibold">Father Name</th>
                  <th className="p-3 border-r border-slate-300 text-center font-semibold">Date of Join</th>
                  <th className="p-3 border-r border-slate-300 text-center font-semibold">Contractor Name</th>
                  <th className="p-3 border-r border-slate-300 text-center font-semibold">% of Marks</th>
                  <th className="p-3 border-r border-slate-300 text-center font-semibold">Result</th>
                  <th className="p-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {results.length > 0 ? (
                  results.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-3 border-r border-slate-200 font-mono font-medium text-slate-800">{item.empCode}</td>
                      <td className="p-3 border-r border-slate-200 text-slate-700">{item.empName}</td>
                      <td className="p-3 border-r border-slate-200 text-slate-700">{item.fatherName}</td>
                      <td className="p-3 border-r border-slate-200 text-center text-slate-600">{item.doj}</td>
                      <td className="p-3 border-r border-slate-200 text-center text-slate-700 font-medium">{item.ezn}</td>
                      <td className="p-3 border-r border-slate-200 text-center font-bold text-emerald-600">{item.sts}</td>
                      <td className="p-3 border-r border-slate-200 text-center font-bold text-indigo-600">{item.marks}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => generateCertificatePDF([item])}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded transition-colors"
                        >
                          Certificate
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                      {isLoading ? 'Fetching records...' : 'No Dojo results found for the selected date.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print Button Centered matching legacy layout */}
        {results.length > 0 && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => generateCertificatePDF(results)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-md transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Certificate PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
