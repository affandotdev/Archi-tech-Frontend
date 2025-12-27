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
import RoleBasedRoute from "./RoleBasedRoute";

// Auth dashboards
import Dashboard from "../../pages/auth/Dashboard";

// Role-specific dashboards
import ArchitectDashboard from "../../pages/architect/Dashboard";
import ClientDashboard from "../../pages/client/ClientDashboard";
import BrowseArchitects from "../../pages/client/BrowseArchitects";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import EngineerDashboard from "../../pages/engineer/Dashboard";

import AdminUsers from "../../pages/admin/AdminUsers";
import AdminUserDetail from "../../pages/admin/AdminUserDetail";
import AdminSettings from "../../pages/admin/AdminSettings";

// Client Profile
import Profile from "../../pages/client/Profile";
import EditProfile from "../../pages/client/EditProfile";

// Architect Profile
import ArchitectProfile from "../../pages/architect/ArchitectProfile";
import EditArchitectProfile from "../../pages/architect/EditArchitectProfile";

// Engineer Profile
import EngineerProfile from '../../pages/engineer/EngineerProfile';
import EditEngineerProfile from "../../pages/engineer/EditEngineerProfile";

import ProfessionVerify from "../../pages/client/ProfessionVerify";
import AdminProfessionRequests from "../../pages/admin/AdminProfessionRequests";
import TestThree from "../../features/portfolio/pages/TestThree";

// Portfolio
import PortfolioList from "../../features/portfolio/pages/PortfolioList";
import ProjectDetail from "../../features/portfolio/pages/ProjectDetail";
import ProjectUpload from "../../features/portfolio/pages/ProjectUpload";
import ProjectEdit from "../../features/portfolio/pages/ProjectEdit";
import ConnectionApprovals from "../../features/follow/pages/ConnectionApprovals";

// Chat
import ChatHome from "../../features/chat/pages/ChatHome";
import ChatPage from "../../features/chat/pages/ChatPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-login" element={<OAuthLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Auth */}
        <Route path="/logout" element={<ProtectedRoute><LogoutButton /></ProtectedRoute>} />
        <Route path="/mfa-setup" element={<ProtectedRoute><MFASetup /></ProtectedRoute>} />
        <Route path="/mfa-verify" element={<ProtectedRoute><MFAVerify /></ProtectedRoute>} />
        <Route path="/mfa-login-verify" element={<MFALoginVerify />} />
        <Route path="/mfa-qr-scanner" element={<ProtectedRoute><MFAQRScanner /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* User must verify profession */}
        <Route path="/verify-profession" element={<ProtectedRoute><ProfessionVerify /></ProtectedRoute>} />

        {/* Role-based Routes */}
        <Route path="/architect/dashboard" element={<ProtectedRoute requiredRole="architect"><ArchitectDashboard /></ProtectedRoute>} />
        <Route path="/engineer/dashboard" element={<ProtectedRoute requiredRole="engineer"><EngineerDashboard /></ProtectedRoute>} />
        <Route path="/client/dashboard" element={<ProtectedRoute requiredRole="client"><ClientDashboard /></ProtectedRoute>} />
        <Route path="/client/browse-architects" element={<ProtectedRoute requiredRole="client"><BrowseArchitects /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

        {/* Admin extra routes */}
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/users/:userId" element={<ProtectedRoute requiredRole="admin"><AdminUserDetail /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />

        <Route path="/admin/profession-requests" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminProfessionRequests />
          </RoleBasedRoute>
        } />

        {/* Client Profile */}
        <Route path="/client/profile" element={<ProtectedRoute requiredRole="client"><Profile /></ProtectedRoute>} />
        <Route path="/client/edit-profile" element={<ProtectedRoute requiredRole="client"><EditProfile /></ProtectedRoute>} />

        {/* Architect Profile */}
        <Route path="/architect/profile" element={<ProtectedRoute requiredRole="architect"><ArchitectProfile /></ProtectedRoute>} />
        <Route path="/architect/edit-profile" element={<ProtectedRoute requiredRole="architect"><EditArchitectProfile /></ProtectedRoute>} />

        {/* Engineer Profile */}
        <Route path="/engineer/profile" element={<ProtectedRoute requiredRole="engineer"><EngineerProfile /></ProtectedRoute>} />
        <Route path="/engineer/edit-profile" element={<ProtectedRoute requiredRole="engineer"><EditEngineerProfile /></ProtectedRoute>} />

        {/* Portfolio Routes */}
        <Route path="/portfolio/list/:userId" element={<PortfolioList />} />
        <Route path="/portfolio/project/:projectId" element={<ProjectDetail />} />
        <Route path="/portfolio/upload" element={<ProtectedRoute><ProjectUpload /></ProtectedRoute>} />
        <Route path="/portfolio/edit/:projectId" element={<ProtectedRoute><ProjectEdit /></ProtectedRoute>} />

        <Route path="/three-test" element={<TestThree />} />

        {/* Connections */}
        <Route path="/connections" element={<ProtectedRoute><ConnectionApprovals /></ProtectedRoute>} />

        {/* Chat */}
        <Route path="/chat" element={<ProtectedRoute><ChatHome /></ProtectedRoute>} />
        <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
