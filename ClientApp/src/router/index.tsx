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
import { WeekoffTransferPage } from '../pages/timeoffice/WeekoffTransferPage';
import { ForgetPunchPage } from '../pages/timeoffice/ForgetPunchPage';
import { ShiftRotationPage } from '../pages/timeoffice/ShiftRotationPage';
import { ShiftRoasterPage } from '../pages/timeoffice/ShiftRoasterPage';
import { EmployeeShiftPage } from '../pages/timeoffice/EmployeeShiftPage';
import { ChangePasswordPage } from '../pages/usermanage/ChangePasswordPage';

import { ImportDojosPage } from '../pages/employee/ImportDojosPage';
import { ImportEmployeesPage } from '../pages/employee/ImportEmployeesPage';

import { LoadingSpinner } from '../components/common/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
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

        {/* ---------------------------------------------------------------- */}
        {/* TIME OFFICE - 10 Menus Exactly Matching Legacy & User Screenshot */}
        {/* ---------------------------------------------------------------- */}
        {/* 1. Attendance Process */}
        <Route path="timeoffice/punch-process" element={<PunchProcessPage />} />
        <Route path="TimeOffice/AttendanceProcess/PunchProcess" element={<PunchProcessPage />} />

        {/* 2. Leave Posting */}
        <Route path="timeoffice/leaves" element={<LeaveRequestPage />} />
        <Route path="TimeOffice/EmployeeLeaves/LeaveRequest" element={<LeaveRequestPage />} />

        {/* 3. Weekoff Transfer */}
        <Route path="timeoffice/weekoff-transfer" element={<WeekoffTransferPage />} />

        {/* 4. Forget Punch */}
        <Route path="timeoffice/forget-punch" element={<ForgetPunchPage />} />

        {/* 5. Shift Rotation */}
        <Route path="timeoffice/shift-rotation" element={<ShiftRotationPage />} />

        {/* 6. Shift Roaster */}
        <Route path="timeoffice/shift-roaster" element={<ShiftRoasterPage />} />
        <Route path="timeoffice/shift-roster" element={<ShiftRoasterPage />} />

        {/* 7. Employee Shift */}
        <Route path="timeoffice/employee-shift" element={<EmployeeShiftPage />} />

        {/* 8. Import Shift */}
        <Route path="timeoffice/import-shift" element={<ImportShiftRosterPage />} />
        <Route path="TimeOffice/Shift/ImportShiftRoster" element={<ImportShiftRosterPage />} />

        {/* 9. Attendance Report */}
        <Route path="timeoffice/reports" element={<AttendanceReportHub />} />
        <Route path="timeoffice/reports/:type" element={<AttendanceReportHub />} />
        <Route path="TimeOffice/AttendanceReportLayout/AttendanceReportLayout" element={<AttendanceReportHub />} />
        <Route path="TimeOffice/AttendanceReportLayout/ShiftWiseAttendance" element={<AttendanceReportHub reportType="ShiftWiseAttendance" />} />
        <Route path="TimeOffice/AttendanceReportLayout/DailyDeptCategoryWiseAttendance" element={<AttendanceReportHub reportType="DailyDeptCategoryWiseAttendance" />} />
        <Route path="TimeOffice/AttendanceReportLayout/DepartmentwiseApiManpower" element={<AttendanceReportHub reportType="DepartmentwiseApiManpower" />} />
        <Route path="TimeOffice/AttendanceReportLayout/PeriodicApiManpower" element={<AttendanceReportHub reportType="PeriodicApiManpower" />} />
        <Route path="TimeOffice/AttendanceReportLayout/ShiftwisePlanVsActual" element={<AttendanceReportHub reportType="ShiftwisePlanVsActual" />} />
        <Route path="TimeOffice/AttendanceReportLayout/GetMusterRoll" element={<AttendanceReportHub reportType="GetMusterRoll" />} />
        <Route path="TimeOffice/AttendanceReportLayout/DailyArrivalReport" element={<AttendanceReportHub reportType="DailyArrivalReport" />} />
        <Route path="TimeOffice/AttendanceReportLayout/IndividualAttendance" element={<AttendanceReportHub reportType="IndividualAttendance" />} />
        <Route path="EmpAttendance/DateWiseManpower" element={<AttendanceReportHub reportType="DateWiseManpower" />} />

        {/* 10. Attendance Verification */}
        <Route path="timeoffice/verify" element={<AttendanceVerifyPage />} />
        <Route path="TimeOffice/DeptVerification/AttendanceVerifyList" element={<AttendanceVerifyPage />} />

        {/* Charts, Salary, Documentation secondary routes */}
        <Route path="charts/manpower" element={<AdminDashboard />} />
        <Route path="charts/attendance" element={<AttendanceReportHub />} />
        <Route path="salary/calculation" element={<AttendanceReportHub />} />
        <Route path="salary/wage-register" element={<AttendanceReportHub />} />
        <Route path="documentation/manual" element={<OrgSetupPage />} />

        {/* User Manage */}
        <Route path="user/change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

