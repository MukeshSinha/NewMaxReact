import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  FileSpreadsheet,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  ArrowLeftRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  UserCog
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface SubMenuItem {
  title: string;
  path: string;
  icon?: React.ElementType;
  isDivider?: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  children?: SubMenuItem[];
}

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useAppStore();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Employees');

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboards',
      icon: LayoutDashboard,
      children: [
        { title: 'Admin Dashboard', path: '/dashboard/admin' },
        { title: 'Contractor Dashboard', path: '/dashboard/contractor' },
        { title: 'Department Dashboard', path: '/dashboard/department' },
        { title: 'Dojo Dashboard', path: '/dashboard/dojo' },
      ],
    },
    {
      title: 'Settings',
      icon: Settings,
      children: [
        { title: 'Structure Setup', path: '/settings/organization', icon: Building2 },
        { title: 'Contractor Registration', path: '/contractor/registration', icon: Building2 },
      ],
    },
    {
      title: 'Employees',
      icon: Users,
      children: [
        { title: 'Dojo Join(Temp)', path: '/employee/temp-joining' },
        { title: 'New Joining', path: '/employee/new', icon: UserPlus },
        { title: 'Profile', path: '/employee/profile', icon: Users },
        { title: '', path: '', isDivider: true },
        { title: 'Import Dojos', path: '/ImportMasters/Master/Dojo', icon: FileSpreadsheet },
        { title: 'Import Employees', path: '/ImportMasters/Master/EmpGenralInfo', icon: FileSpreadsheet },
        { title: '', path: '', isDivider: true },
        { title: 'Download Employees', path: '/employee/list', icon: FileSpreadsheet },
        { title: 'Dojo Certificate', path: '/employee/dojo-results' },
        { title: 'Department Transfer', path: '/employee/duty-transfer', icon: ArrowLeftRight },
      ],
    },
    {
      title: 'Contractor Master',
      icon: Building2,
      children: [
        { title: 'Contractor Registration', path: '/contractor/registration' },
        { title: 'Import Employees Excel', path: '/masters/import-employees' },
      ],
    },
    {
      title: 'Time Office',
      icon: Clock,
      children: [
        { title: 'Attendance Process', path: '/timeoffice/punch-process', icon: CalendarCheck },
        { title: 'Attendance Verification', path: '/timeoffice/verify', icon: CheckCircle2 },
        { title: 'Leave Posting', path: '/timeoffice/leaves' },
        { title: 'Import Shift Roster', path: '/timeoffice/import-shift' },
      ],
    },
    {
      title: 'Attendance Reports',
      icon: FileSpreadsheet,
      children: [
        { title: 'Reports Hub', path: '/timeoffice/reports' },
        { title: 'Muster Roll Report', path: '/timeoffice/reports/muster-roll' },
        { title: 'Daily Absenteeism', path: '/timeoffice/reports/absenteeism' },
        { title: 'Plan vs Actual', path: '/timeoffice/reports/plan-vs-actual' },
        { title: 'Dept Manpower API', path: '/timeoffice/reports/dept-manpower' },
      ],
    },
    {
      title: 'User Manage',
      icon: Settings,
      children: [
        { title: 'Organization Setup', path: '/settings/organization', icon: UserCog },
        { title: 'Dojo Master Criteria', path: '/masters/dojo' },
        { title: 'Change Password', path: '/user/change-password', icon: ShieldCheck },
      ],
    },
  ];

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 text-slate-300 flex flex-col h-screen sticky top-0 z-30 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <img src="/logo.svg" alt="MaxPay Logo" className="h-9 object-contain" />
        <div>
          <h1 className="font-bold text-white tracking-wide text-sm leading-tight">MaxPay</h1>
          <span className="text-[11px] text-indigo-400 font-medium">Contractor Management</span>
        </div>
      </div>

      {/* Menu List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSubOpen = openSubmenu === item.title;
          const hasActiveChild = item.children?.some((child) => location.pathname === child.path);

          return (
            <div key={item.title} className="space-y-1">
              <button
                onClick={() => toggleSubmenu(item.title)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${hasActiveChild || isSubOpen
                    ? 'bg-slate-800/80 text-indigo-400 font-semibold'
                    : 'hover:bg-slate-800/40 text-slate-300 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${hasActiveChild ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                </div>
                {isSubOpen ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
              </button>

              {/* Submenu Dropdown */}
              {isSubOpen && item.children && (
                <div className="pl-9 pr-2 py-1 space-y-1 border-l-2 border-slate-800 ml-5">
                  {item.children.map((child, cIdx) => {
                    if (child.isDivider) {
                      return <div key={`div-${cIdx}`} className="my-1.5 border-t border-slate-800/80" />;
                    }
                    const ChildIcon = child.icon;
                    return (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${isActive
                            ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          }`
                        }
                      >
                        {ChildIcon && <ChildIcon className="w-3.5 h-3.5" />}
                        <span>{child.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
        Maxpay Contractor UI v2.0
      </div>
    </aside>
  );
};
