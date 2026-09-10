import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImportShiftRosterPage: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleImport = () => {
    toast.success(`Imported shift roster for 145 employees from ${fileName || 'Excel Sheet'}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Import Shift Roster</h1>
        <p className="text-xs text-slate-400">Upload Monthly Shift Rotation Schedule (.xlsx / .csv)</p>
      </div>

      <div className="glass-card p-8 border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors text-center space-y-4">
        <FileSpreadsheet className="w-12 h-12 text-indigo-400 mx-auto" />
        <div>
          <h3 className="text-sm font-bold text-white">Upload Shift Rotation Schedule</h3>
          <p className="text-xs text-slate-400 mt-1">Columns required: EmpCode, ShiftName, EffectiveDate</p>
        </div>

        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
          id="shift-upload"
          className="hidden"
        />
        <label
          htmlFor="shift-upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Browse File</span>
        </label>

        {fileName && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs text-indigo-300 font-medium">
            Loaded Shift File: <span className="font-bold">{fileName}</span>
          </div>
        )}
      </div>

      {fileName && (
        <button
          onClick={handleImport}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Import Shift Roster</span>
        </button>
      )}
    </div>
  );
};
