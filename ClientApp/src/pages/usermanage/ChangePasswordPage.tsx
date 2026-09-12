import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const ChangePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      const response = await fetch('/api/UserLogin/ChangePasswordConfirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const resVal = await response.json();
      if (response.ok && resVal !== 0 && resVal !== "0") {
        toast.success('Your security password has been changed successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to update password');
      }
    } catch (err) {
      toast.error('Failed to update password');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Change Security Password</h1>
        <p className="text-xs text-slate-500">Update User Account Credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Update Password</span>
        </button>
      </form>
    </div>
  );
};
