import React from 'react';

export interface AttendanceCardProps {
  title: string;
  onRoll: number | string;
  present: number | string;
  leave?: number | string;
  weekOff?: number | string;
  variant: 'danger' | 'info' | 'success';
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  title,
  onRoll,
  present,
  leave = '',
  weekOff = '',
  variant,
}) => {
  const gradientClass = {
    danger: 'bg-gradient-to-br from-rose-500 via-rose-600 to-orange-400',
    info: 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400',
    success: 'bg-gradient-to-br from-teal-600 via-emerald-500 to-emerald-400',
  }[variant];

  return (
    <div
      className={`${gradientClass} text-white rounded-2xl p-5 shadow-lg shadow-black/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden`}
    >
      {/* Soft background glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

      <h5 className="text-lg font-extrabold tracking-wide mb-3 text-white drop-shadow-sm">
        {title}
      </h5>

      <div className="space-y-1.5 text-sm font-semibold tracking-wide text-white/95">
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <span>OnRoll :</span>
          <span className="font-extrabold text-base text-white">{onRoll}</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <span>Present :</span>
          <span className="font-extrabold text-base text-white">{present}</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <span>Leave :</span>
          <span className="font-extrabold text-base text-white">{leave}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Week Off :</span>
          <span className="font-extrabold text-base text-white">{weekOff}</span>
        </div>
      </div>
    </div>
  );
};
