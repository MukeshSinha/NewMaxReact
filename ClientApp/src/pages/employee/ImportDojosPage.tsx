import React, { useState } from 'react';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const ImportDojosPage: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (json && json.length > 0) {
          const parsedHeaders = json[0].map((h: any, idx: number) => String(h || `Col ${idx + 1}`));
          const parsedRows = json.slice(1).map((row: any[]) => {
            const rowObj: Record<string, any> = {};
            parsedHeaders.forEach((h, idx) => {
              rowObj[h] = row[idx] !== undefined ? String(row[idx]) : '';
            });
            return rowObj;
          });

          setHeaders(parsedHeaders);
          setTableData(parsedRows);
          setCurrentPage(1);
          toast.success(`Successfully loaded ${parsedRows.length} rows from ${file.name}`);
        } else {
          toast.error('The selected Excel file is empty.');
          setHeaders([]);
          setTableData([]);
        }
      } catch (err) {
        toast.error('Failed to parse Excel file.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const totalPages = Math.ceil(tableData.length / pageSize) || 1;
  const paginatedData = tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full bg-[#f4f2f7] min-h-screen text-slate-800 p-6 font-sans">
      <div className="max-w-[100%] mx-auto space-y-6">
        {/* Page Header matching exact screenshot icon & title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Download className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Dojos</h2>
        </div>

        {/* File Upload Box matching screenshot */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
          <label className="block text-xs font-semibold text-slate-600 mb-2">Select Dojo Excel File (.xlsx / .xls)</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full text-xs text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-slate-300 rounded cursor-pointer"
          />
        </div>

        {/* Tabulator Preview Table */}
        {tableData.length > 0 && (
          <div className="bg-white rounded-md shadow-sm border border-slate-300 overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Preview Data ({tableData.length} Records)</span>
              <span className="text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
            </div>

            <div className="overflow-x-auto min-h-[350px]">
              <table className="w-full text-xs text-left text-slate-700 border-collapse">
                <thead className="bg-[#e4e1eb] text-slate-800 uppercase font-bold border-b border-slate-300">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="p-2.5 border-r border-slate-300 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedData.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#f9f8fc]'}>
                      {headers.map((h, cIdx) => (
                        <td key={cIdx} className="p-2 border-r border-slate-200 whitespace-nowrap font-mono text-[11px]">
                          {row[h] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Row */}
            <div className="bg-[#e8e5ef] p-2 flex items-center justify-end border-t border-slate-300 text-xs">
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
                <span className="px-2 font-bold text-slate-700">{currentPage}</span>
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
        )}
      </div>
    </div>
  );
};
