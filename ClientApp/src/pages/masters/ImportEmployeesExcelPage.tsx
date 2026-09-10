import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const ImportEmployeesExcelPage: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rowCount, setRowCount] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws);
        setRowCount(data.length);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await fetch('/api/Master/ImportEmpGeneralInfo', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        toast.success(`Imported ${rowCount || 0} employee records from ${fileName}`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      toast.error('Failed to upload Excel file to server.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Import Employees from Excel</h1>
        <p className="text-xs text-slate-400">Bulk Worker Data Upload (.xlsx / .csv)</p>
      </div>

      <div className="glass-card p-8 border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors text-center space-y-4">
        <FileSpreadsheet className="w-12 h-12 text-indigo-400 mx-auto" />
        <div>
          <h3 className="text-sm font-bold text-white">Select Worker Master Excel Sheet</h3>
          <p className="text-xs text-slate-400 mt-1">Supports columns: EmpCode, Name, Contractor, Department, Category, Mobile</p>
        </div>

        <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} id="excel-upload" className="hidden" />
        <label
          htmlFor="excel-upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Browse File</span>
        </label>

        {fileName && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs text-indigo-300 font-medium">
            Loaded File: <span className="font-bold">{fileName}</span> ({rowCount} records ready for import)
          </div>
        )}
      </div>

      {fileName && (
        <button
          onClick={handleImport}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Process & Save Imported Workers</span>
        </button>
      )}
    </div>
  );
};
