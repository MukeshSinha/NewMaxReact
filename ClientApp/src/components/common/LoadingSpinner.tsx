import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading data...',
  size = 'md',
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-12 h-12 rounded-full bg-indigo-500/20 animate-ping"></div>
        {/* Primary Spinner */}
        <div
          className={`${sizeClasses[size]} border-indigo-500/20 border-t-indigo-500 border-r-indigo-400 rounded-full animate-spin shadow-lg shadow-indigo-500/30`}
        ></div>
        {/* Secondary Reverse Spinner */}
        <div
          className="w-6 h-6 border-2 border-emerald-500/20 border-b-emerald-400 rounded-full animate-spin absolute"
          style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}
        ></div>
      </div>
      {message && (
        <span className="text-xs font-bold text-indigo-600 tracking-wider animate-pulse">
          {message}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl border border-slate-200 shadow-2xl bg-white">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
};
