import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  rollValue?: number | string;
  icon: LucideIcon;
  gradient: string;
  trend?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  rollValue,
  icon: Icon,
  gradient,
  trend,
}) => {
  return (
    <div className="glass-card glass-card-hover p-5 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-xl ${gradient}`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{value}</h3>
          {rollValue !== undefined && (
            <p className="text-xs text-slate-400 mt-1 font-medium">
              On Roll: <span className="text-indigo-400 font-semibold">{rollValue}</span>
            </p>
          )}
          {trend && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {trend}
            </span>
          )}
        </div>

        <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner`}>
          <Icon className="w-6 h-6 text-indigo-400" />
        </div>
      </div>
    </div>
  );
};
