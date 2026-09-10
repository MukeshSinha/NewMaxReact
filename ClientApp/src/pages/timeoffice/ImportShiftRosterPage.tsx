import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle,
  FileUp,
  AlertCircle,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { maxpayService } from '../../services/maxpayService';

export const ImportShiftRosterPage: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [importing, setImporting] = useState<boolean>(false);

  // Exact dynamic Excel parsing matching legacy ImportShiftRoster.cshtml
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error('Please select an Excel file.');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const buffer = event.target?.result;
        if (!buffer) return;

        const data = new Uint8Array(buffer as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // First sheet in workbook
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!json || json.length === 0) {
          toast.error('The selected Excel file is empty.');
          return;
        }

        // Extract dynamic headers from row 0
        const fileHeaders: string[] = json[0].map((h: any) => String(h ?? '').trim());
        setHeaders(fileHeaders);

        // Extract dynamic data rows
        const fileRows = json.slice(1).filter((r) => r.length > 0 && r.some((cell) => cell !== undefined && cell !== ''));
        setRows(fileRows);

        toast.success(`Successfully parsed ${fileRows.length} rows from "${file.name}"!`);
      } catch (err) {
        console.error(err);
        toast.error('Error parsing Excel file. Please ensure valid .xlsx or .xls file.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Upload/Commit parsed data to backend
  const handleCommitImport = async () => {
    if (rows.length === 0) {
      toast.error('No shift rows to import. Please upload an Excel file first.');
      return;
    }

    setImporting(true);
    try {
      await maxpayService.uploadShiftRosterExcel(rows);
      toast.success(`Shift roster successfully imported for ${rows.length} records!`);
    } catch {
      toast.error('Failed to commit shift roster data.');
    } finally {
      setImporting(false);
    }
  };

  const handleClear = () => {
    setFileName(null);
    setHeaders([]);
    setRows([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner matching legacy ImportShiftRoster */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Import Shift Roster</h1>
            <p className="text-xs text-slate-400">
              Upload monthly shift roster Excel file (.xlsx / .xls) with dynamic sheet parsing and data preview
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono self-start sm:self-auto">
          Area: TimeOffice / Shift / ImportShiftRoster
        </div>
      </div>

      {/* Upload Box matching legacy input */}
      <div className="glass-card p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500/70 rounded-2xl bg-slate-900/60 transition-all text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mx-auto">
          <FileSpreadsheet className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Select Excel File (.xlsx / .xls)</h3>
          <p className="text-xs text-slate-400 mt-1">
            The sheet columns and rows will be read and displayed dynamically in the table below.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            id="fileUpload"
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/30 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Choose Excel File</span>
          </label>
        </div>

        {fileName && (
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-950/50 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
            <span>
              Uploaded File: <strong className="text-white">{fileName}</strong> ({rows.length} rows parsed)
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-400"
              title="Remove File"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Data Table matching legacy #excelTable */}
      {rows.length > 0 && (
        <div className="glass-card p-5 border border-slate-800 rounded-2xl bg-slate-900/70 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Excel Sheet Preview (Dynamic Rows)</h2>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/50">
              {rows.length} Data Rows • {headers.length} Columns
            </span>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl">
            <table className="w-full text-xs text-left" id="excelTable">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950 sticky top-0">
                  <th className="py-2.5 px-3 w-10 text-slate-500 font-mono">#</th>
                  {headers.map((h, i) => (
                    <th key={i} className="py-2.5 px-3 font-semibold text-slate-200">
                      {h || `Col_${i + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-slate-600 font-mono text-[10px]">{rIdx + 1}</td>
                    {headers.map((_, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 text-slate-300">
                        {String(row[cIdx] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Upload / Commit Button matching legacy #btnUpload */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              id="btnUpload"
              onClick={handleCommitImport}
              disabled={importing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <CheckCircle className={`w-4 h-4 ${importing ? 'animate-spin' : ''}`} />
              <span>{importing ? 'Uploading to Server...' : 'Upload Shift Roster'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


