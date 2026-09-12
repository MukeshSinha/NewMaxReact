import React, { useState } from 'react';
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import { LoadingSpinner } from './LoadingSpinner';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  exportFileName?: string;
  totalRow?: React.ReactNode;
  headerControls?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  searchPlaceholder = 'Search...',
  exportFileName = 'report',
  totalRow,
  headerControls,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${exportFileName}.xlsx`);
  };

  return (
    <div className="glass-card p-5 space-y-4 relative">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          {title && <h3 className="text-base font-bold text-slate-800 tracking-wide">{title}</h3>}
          {headerControls}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Export Excel Button */}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 relative min-h-[180px]">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`p-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10">
                  <LoadingSpinner message="Fetching live records..." size="md" />
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`p-3.5 ${col.className || ''}`}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center p-8 text-slate-400 font-medium">
                  No records found
                </td>
              </tr>
            )}
            {!isLoading && totalRow}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
        <span>
          Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <span className="font-semibold text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
