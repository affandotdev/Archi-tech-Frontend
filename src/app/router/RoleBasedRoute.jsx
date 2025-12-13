import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
    const { user, role, mfaVerified } = useContext(AuthContext);
    const accessToken = localStorage.getItem("access");

    // Check if user is authenticated
    if (!user && !accessToken) {
        return <Navigate to="/login" />;
    }

    // Check if MFA is verified
    if (accessToken && !mfaVerified) {
        return <Navigate to="/mfa-login-verify" />;
    }

    // Check if user's role is in the allowed roles list
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard based on user's actual role
        if (role === "architect") return <Navigate to="/architect/dashboard" />;
        if (role === "engineer") return <Navigate to="/engineer/dashboard" />;
        if (role === "admin") return <Navigate to="/admin/dashboard" />;
        // Default to client dashboard
        return <Navigate to="/client/dashboard" />;
    }

    return children;
};

export default RoleBasedRoute;
