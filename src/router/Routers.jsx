import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/Login";
import Department from "../pages/admin pages/Department";
import Designation from "../pages/admin pages/Designation";
import UserRegister from "../pages/admin pages/UserRegister";
import NrReports from "../pages/admin pages/NrReports.jsx";
import ReportComingSoon from "../pages/admin pages/ReportComingSoon";

// Protected Route
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // Token nahi hai -> Login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token hai -> requested page
  return <Outlet />;
};

const Routers = () => {
  return (
    <Routes>
      {/* ================= LOGIN ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Admin Pages */}
          <Route path="department" element={<Department />} />
          <Route path="nr-report" element={<NrReports />} />
          <Route path="ignition-disconnect" element={<ReportComingSoon />} />
          <Route path="data-delay" element={<ReportComingSoon />} />

          <Route path="designation" element={<Designation />} />

          <Route path="user-register" element={<UserRegister />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routers;
