import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center bg-white mt-auto">
      <div>
        Copyright © 2026 <span className="text-indigo-600 font-semibold">MAXPay</span>. All Rights Reserved.
      </div>
      <div className="mt-2 sm:mt-0 text-slate-400">
        MaxPay Workforce & Contractor Suite
      </div>
    </footer>
  );
};
