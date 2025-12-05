import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../../pages/client/LandingPage";
import Register from "../../pages/auth/Register";

import Login from "../../pages/auth/Login";
import OAuthLogin from "../../pages/auth/OAuthLogin";
import VerifyOtp from "../../pages/auth/VerifyOtp";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import ResetPassword from "../../pages/auth/ResetPassword";
import LogoutButton from "../../pages/auth/Logout Button";
import MFASetup from "../../pages/auth/MFASetup";
import MFAVerify from "../../pages/auth/MFAVerify";
import MFALoginVerify from "../../pages/auth/MFALoginVerify";
import MFAQRScanner from "../../features/mfa/MFAQRScanner";
import ProtectedRoute from "./ProtectedRoute";
// Auth dashboards
import Dashboard from "../../pages/auth/Dashboard";

// Role-specific dashboards
import ArchitectDashboard from "../../pages/architect/Dashboard";
import ClientDashboard from "../../pages/client/ClientDashboard";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import EngineerDashboard from "../../pages/engineer/Dashboard";
import AdminUsers from "../../pages/admin/AdminUsers";
import AdminSettings from "../../pages/admin/AdminSettings";
import Profile from "../../pages/client/Profile";
import EditProfile from "../../pages/client/EditProfile";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-login" element={<OAuthLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/logout" element={<ProtectedRoute><LogoutButton/></ProtectedRoute>} />
        <Route path="/mfa-setup" element={<ProtectedRoute><MFASetup /></ProtectedRoute>} />
        <Route path="/mfa-verify" element={<ProtectedRoute><MFAVerify /></ProtectedRoute>} />
        <Route path="/mfa-login-verify" element={<MFALoginVerify />} />
        <Route path="/mfa-qr-scanner" element={<ProtectedRoute><MFAQRScanner /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* Role-specific dashboards */}
  
        <Route path="/architect/dashboard" element={<ProtectedRoute><ArchitectDashboard /></ProtectedRoute>} />
        <Route path="/engineer/dashboard" element={<ProtectedRoute><EngineerDashboard /></ProtectedRoute>} />
        <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="/client/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/client/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
       
        
      </Routes>
    </BrowserRouter>
  );
}
