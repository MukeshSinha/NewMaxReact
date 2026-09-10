import React from 'react';
import { Award } from 'lucide-react';

export const DojoMasterPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Dojo Criteria & Training Master</h1>
        <p className="text-xs text-slate-400">Configure Skill Tests, Qualifying Marks & Passing Standards</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>Active Dojo Skill Criteria</span>
        </h3>
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900/60 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-white">Assembly Safety & Torque Wrench Test</p>
              <p className="text-slate-400">Duration: 30 Mins • Minimum Pass Score: 85%</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400">Active</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-white">Body Shop Welding & Quality Inspection</p>
              <p className="text-slate-400">Duration: 45 Mins • Minimum Pass Score: 80%</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
