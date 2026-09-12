import React from 'react';
import { Menu, Search, Bell, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { toggleSidebar, selectedDate, setSelectedDate } = useAppStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 text-slate-700 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="MaxPay Logo" className="h-8 object-contain" />
          <span className="font-bold text-slate-800 tracking-wide text-sm hidden sm:inline-block">MaxPay Contractor Management</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee, contractor..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Live Date Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <span className="text-xs text-slate-500 font-medium hidden md:inline">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-0 text-xs text-indigo-600 font-semibold focus:outline-none cursor-pointer"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {user?.username?.charAt(0) || 'A'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.username || 'Admin User'}</p>
            <span className="text-[10px] text-indigo-600 font-medium">{user?.role || 'Admin'} Role</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors ml-1"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
