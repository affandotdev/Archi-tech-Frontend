import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, role, mfaVerified } = useContext(AuthContext);
  const accessToken = localStorage.getItem("access");

  // Check if user is authenticated
  if (!user && !accessToken) {
    return <Navigate to="/login" />;
  }

  // Check if MFA is verified (if access token exists, MFA should be verified)
  // Only check MFA if we have an access token (meaning login was successful)
  if (accessToken && !mfaVerified) {
    // If there's an access token but MFA isn't verified, redirect to MFA verification
    return <Navigate to="/mfa-login-verify" />;
  }

  // Check if specific role is required
  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    if (role === "architect") return <Navigate to="/architect/dashboard" />;
    if (role === "engineer") return <Navigate to="/engineer/dashboard" />;
    if (role === "admin") return <Navigate to="/admin/dashboard" />;
    // Default to client dashboard if role doesn't match
    return <Navigate to="/client/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
