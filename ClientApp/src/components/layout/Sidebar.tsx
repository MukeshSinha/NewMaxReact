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
  CalendarCheck,
  CheckCircle2,
  UserCog,
  BarChart3,
  Banknote,
  FileText,
  CalendarOff,
  AlertCircle,
  RotateCw,
  CalendarRange,
  UserCheck,
  FileUp,
  ArrowRight
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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Time Office');

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
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
      title: 'Time Office',
      icon: Clock,
      children: [
        { title: 'Attendance Process', path: '/timeoffice/punch-process', icon: CalendarCheck },
        { title: 'Leave Posting', path: '/timeoffice/leaves', icon: CalendarOff },
        { title: 'Weekoff Transfer', path: '/timeoffice/weekoff-transfer', icon: ArrowLeftRight },
        { title: 'Forget Punch', path: '/timeoffice/forget-punch', icon: AlertCircle },
        { title: '', path: '', isDivider: true },
        { title: 'Shift Rotation', path: '/timeoffice/shift-rotation', icon: RotateCw },
        { title: 'Shift Roaster', path: '/timeoffice/shift-roaster', icon: CalendarRange },
        { title: 'Employee Shift', path: '/timeoffice/employee-shift', icon: UserCheck },
        { title: '', path: '', isDivider: true },
        { title: 'Import Shift', path: '/timeoffice/import-shift', icon: FileUp },
        { title: 'Attendance Report', path: '/timeoffice/reports', icon: FileSpreadsheet },
        { title: 'Attendance Verification', path: '/timeoffice/verify', icon: CheckCircle2 },
      ],
    },
    {
      title: 'Charts',
      icon: BarChart3,
      children: [
        { title: 'Manpower Analytics', path: '/charts/manpower' },
        { title: 'Attendance Trends', path: '/charts/attendance' },
      ],
    },
    {
      title: 'Salary',
      icon: Banknote,
      children: [
        { title: 'Salary Slip / Calculation', path: '/salary/calculation' },
        { title: 'Monthly Wage Register', path: '/salary/wage-register' },
      ],
    },
    {
      title: 'User Manage',
      icon: UserCog,
      children: [
        { title: 'Organization Setup', path: '/settings/organization', icon: UserCog },
        { title: 'Dojo Master Criteria', path: '/masters/dojo' },
        { title: 'Change Password', path: '/user/change-password', icon: ShieldCheck },
      ],
    },
    {
      title: 'Documentation',
      icon: FileText,
      children: [
        { title: 'API & User Manual', path: '/documentation/manual' },
      ],
    },
  ];

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-600 flex flex-col h-screen sticky top-0 z-30 transition-all duration-300 shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-600/30">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 tracking-wide text-sm leading-tight">MaxPay Contractor UI</h1>
          <span className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">Time & Attendance</span>
        </div>
      </div>

      {/* Menu List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSubOpen = openSubmenu === item.title;
          const hasActiveChild = item.children?.some((child) => location.pathname === child.path);

          return (
            <div key={item.title} className="space-y-1">
              <button
                onClick={() => toggleSubmenu(item.title)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  hasActiveChild || isSubOpen
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${hasActiveChild || isSubOpen ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                </div>
                {isSubOpen ? (
                  <ChevronDown className="w-4 h-4 text-indigo-600 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-200" />
                )}
              </button>

              {/* Submenu Dropdown */}
              {isSubOpen && item.children && (
                <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-indigo-200 ml-4">
                  {item.children.map((child, cIdx) => {
                    if (child.isDivider) {
                      return <div key={`div-${cIdx}`} className="my-1.5 border-t border-slate-200" />;
                    }
                    return (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`
                        }
                      >
                        {/* Right arrow bullet matching legacy design */}
                        <ArrowRight className={`w-3 h-3 shrink-0 ${location.pathname === child.path ? 'text-white' : 'text-indigo-500'}`} />
                        <span className="truncate">{child.title}</span>
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
      <div className="p-3 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-between px-4 bg-slate-50">
        <span>Maxpay Contractor UI</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono">v2.0</span>
      </div>
    </aside>
  );
};

