import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, Building2, Layers, Award, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Contractor' | 'Department' | 'Dojo'>('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const targetRole = user?.role || 'Admin';
      if (targetRole === 'Contractor') navigate('/dashboard/contractor', { replace: true });
      else if (targetRole === 'Department') navigate('/dashboard/department', { replace: true });
      else if (targetRole === 'Dojo') navigate('/dashboard/dojo', { replace: true });
      else navigate('/dashboard/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/UserLogin/VerifyUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        toast.error('Invalid UserID or Password.');
        setIsLoading(false);
        return;
      }

      const jdata = await response.json();
      console.log('Login Response:', jdata);

      if (!jdata || String(jdata.verifyCode ?? jdata.VerifyCode) !== '1') {
        toast.error('Invalid UserID or Password.');
        setIsLoading(false);
        return;
      }

      // Redirection logic based on roleID from VerifyUser (Matching Login.cshtml)
      const rawRoleId = jdata.roleID ?? jdata.roleId ?? jdata.RoleID;
      const roleId = Number(rawRoleId);

      let targetRole: 'Admin' | 'Contractor' | 'Department' | 'Dojo' = role;
      let targetPath = '/dashboard/admin';

      if (roleId === 3) {
        targetRole = 'Contractor';
        targetPath = '/dashboard/contractor';
      } else if (roleId === 1) {
        targetRole = 'Admin';
        targetPath = '/dashboard/admin';
      } else if (roleId === 2) {
        targetRole = 'Department';
        targetPath = '/dashboard/department';
      } else if (roleId === 4) {
        targetRole = 'Dojo';
        targetPath = '/dashboard/dojo';
      } else {
        // Fallback to quick selector state if roleID is not matched
        if (role === 'Contractor') targetPath = '/dashboard/contractor';
        else if (role === 'Department') targetPath = '/dashboard/department';
        else if (role === 'Dojo') targetPath = '/dashboard/dojo';
        else targetPath = '/dashboard/admin';
      }

      login(username, targetRole);
      toast.success(`Welcome back, ${username}!`);
      navigate(targetPath);

    } catch (err) {
      toast.error('Invalid UserID or Password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 relative z-10 space-y-6 border border-slate-800 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img src="/maxpay-logo.svg" alt="MaxPay Logo" className="w-16 h-16 mx-auto rounded-2xl shadow-xl shadow-indigo-600/40 object-contain hover:scale-105 transition-transform duration-300" />
          <h1 className="text-2xl font-extrabold text-white tracking-wide">MaxPay App</h1>
          <p className="text-xs text-slate-400">Contractor & Workforce Management Suite</p>
        </div>

        {/* Role Quick Selector */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {[
            { key: 'Admin', label: 'Admin', icon: Shield },
            { key: 'Contractor', label: 'Vendor', icon: Building2 },
            { key: 'Department', label: 'Dept', icon: Layers },
            { key: 'Dojo', label: 'Dojo', icon: Award },
          ].map((r) => {
            const Icon = r.icon;
            const active = role === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key as any)}
                className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
                  active
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Username / ID</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to {role} Portal</span>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500">
          Copyright © 2026 <span className="text-indigo-400 font-semibold">MAXPay</span>. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};
