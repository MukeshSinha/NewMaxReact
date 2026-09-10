import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboard } from '../pages/dashboards/AdminDashboard';
import { ContractorDashboard } from '../pages/dashboards/ContractorDashboard';
import { DepartmentDashboard } from '../pages/dashboards/DepartmentDashboard';
import { DojoDashboard } from '../pages/dashboards/DojoDashboard';
import { NewEmployeeWizard } from '../pages/employee/NewEmployeeWizard';
import { EmployeeMasterList } from '../pages/employee/EmployeeMasterList';
import { DutyTransferPage } from '../pages/employee/DutyTransferPage';
import { EmployeeProfilePage } from '../pages/employee/EmployeeProfilePage';
import { TempJoiningPage } from '../pages/employee/TempJoiningPage';
import { PromoteEmployeePage } from '../pages/employee/PromoteEmployeePage';
import { DojoTraineeList } from '../pages/employee/DojoTraineeList';
import { DojoResultCertificatePage } from '../pages/employee/DojoResultCertificatePage';
import { ContractorRegistrationPage } from '../pages/contractor/ContractorRegistrationPage';
import { DojoMasterPage } from '../pages/masters/DojoMasterPage';
import { ImportEmployeesExcelPage } from '../pages/masters/ImportEmployeesExcelPage';
import { OrgSetupPage } from '../pages/settings/OrgSetupPage';
import { PunchProcessPage } from '../pages/timeoffice/PunchProcessPage';
import { AttendanceVerifyPage } from '../pages/timeoffice/AttendanceVerifyPage';
import { AttendanceReportHub } from '../pages/timeoffice/AttendanceReportHub';
import { LeaveRequestPage } from '../pages/timeoffice/LeaveRequestPage';
import { ImportShiftRosterPage } from '../pages/timeoffice/ImportShiftRosterPage';
import { ChangePasswordPage } from '../pages/usermanage/ChangePasswordPage';

import { ImportDojosPage } from '../pages/employee/ImportDojosPage';
import { ImportEmployeesPage } from '../pages/employee/ImportEmployeesPage';

import { LoadingSpinner } from '../components/common/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <LoadingSpinner message="Restoring session..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Main Layout Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/admin" replace />} />
        <Route path="dashboard/admin" element={<AdminDashboard />} />
        <Route path="dashboard/contractor" element={<ContractorDashboard />} />
        <Route path="dashboard/department" element={<DepartmentDashboard />} />
        <Route path="dashboard/dojo" element={<DojoDashboard />} />

        {/* Employee */}
        <Route path="employee/new" element={<NewEmployeeWizard />} />
        <Route path="employee/list" element={<EmployeeMasterList />} />
        <Route path="employee/duty-transfer" element={<DutyTransferPage />} />
        <Route path="employee/profile" element={<EmployeeProfilePage />} />
        <Route path="employee/profile/:id" element={<EmployeeProfilePage />} />
        <Route path="employee/temp-joining" element={<TempJoiningPage />} />
        <Route path="employee/promote" element={<PromoteEmployeePage />} />
        <Route path="employee/dojo-list" element={<DojoTraineeList />} />
        <Route path="employee/dojo-results" element={<DojoResultCertificatePage />} />

        {/* Legacy & New Import Master Routes */}
        <Route path="ImportMasters/Master/Dojo" element={<ImportDojosPage />} />
        <Route path="import/dojo" element={<ImportDojosPage />} />
        <Route path="ImportMasters/Master/EmpGenralInfo" element={<ImportEmployeesPage />} />
        <Route path="ImportMasters/Master/ImportEmployeesFromExcel" element={<ImportEmployeesPage />} />
        <Route path="import/employees" element={<ImportEmployeesPage />} />

        {/* Settings & Organization */}
        <Route path="settings/organization" element={<OrgSetupPage />} />
        <Route path="OrganizationSetting/OrgSetup/OrgSetupLayout" element={<OrgSetupPage />} />
        <Route path="contractor/registration" element={<ContractorRegistrationPage />} />
        <Route path="Contractor/ContractorMaster/RegisterContractor" element={<ContractorRegistrationPage />} />
        <Route path="masters/dojo" element={<DojoMasterPage />} />
        <Route path="masters/import-employees" element={<ImportEmployeesPage />} />

        {/* Time Office */}
        <Route path="timeoffice/punch-process" element={<PunchProcessPage />} />
        <Route path="timeoffice/verify" element={<AttendanceVerifyPage />} />
        <Route path="timeoffice/reports" element={<AttendanceReportHub />} />
        <Route path="timeoffice/reports/:type" element={<AttendanceReportHub />} />
        <Route path="timeoffice/leaves" element={<LeaveRequestPage />} />
        <Route path="timeoffice/import-shift" element={<ImportShiftRosterPage />} />

        {/* User Manage */}
        <Route path="user/change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
