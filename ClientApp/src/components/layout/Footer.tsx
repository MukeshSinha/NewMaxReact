import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center bg-slate-900/60 mt-auto">
      <div>
        Copyright © 2026 <span className="text-indigo-400 font-semibold">MAXPay</span>. All Rights Reserved.
      </div>
      <div className="mt-2 sm:mt-0 text-slate-500">
        MaxPay Workforce & Contractor Suite
      </div>
    </footer>
  );
};
