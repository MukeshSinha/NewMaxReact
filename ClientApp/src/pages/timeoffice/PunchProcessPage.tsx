import React, { useState } from 'react';
import { Play } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export const PunchProcessPage: React.FC = () => {
  const [processDate, setProcessDate] = useState(new Date().toISOString().split('T')[0]);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    setProcessing(true);
    try {
      const res = await axios.post('/api/AttendanceProcess/Punchprocessing', {
        ProcessDate: processDate,
      });
      toast.success(`Processed raw punch logs for date ${processDate}. Result: ${JSON.stringify(res.data)}`);
    } catch {
      toast.error(`Failed to process punch logs for ${processDate}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Daily Attendance Punch Process</h1>
        <p className="text-xs text-slate-400">Process Raw Biometric Punches & Generate Shift Overtime Logs</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Select Attendance Processing Date</label>
          <input
            type="date"
            value={processDate}
            onChange={(e) => setProcessDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleProcess}
          disabled={processing}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all"
        >
          <Play className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
          <span>{processing ? 'Processing Punch Logs...' : 'Execute Punch Processing'}</span>
        </button>
      </div>
    </div>
  );
};
