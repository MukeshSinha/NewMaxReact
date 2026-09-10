import React, { useState } from 'react';
import { Award } from 'lucide-react';
import toast from 'react-hot-toast';

export const PromoteEmployeePage: React.FC = () => {
  const [empCode, setEmpCode] = useState('');
  const [newCategory, setNewCategory] = useState('Regular');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/TempJoin/SavePromotionResult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: [{ empCode, result: newCategory, marks: 100 }],
          passdt: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        toast.success(`Worker ${empCode} promoted to ${newCategory} category`);
      }
    } catch (err) {
      toast.error('Failed to execute promotion');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Promote Temporary Worker</h1>
        <p className="text-xs text-slate-400">Upgrade Worker Status from Temporary to Regular / Permanent</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Temporary Worker Code</label>
          <input
            type="text"
            placeholder="e.g. TMP101"
            value={empCode}
            onChange={(e) => setEmpCode(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">New Category Promotion</label>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          >
            <option>Regular</option>
            <option>FOT</option>
            <option>Supervisor Trainee</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
        >
          <Award className="w-4 h-4" />
          <span>Execute Promotion</span>
        </button>
      </form>
    </div>
  );
};
