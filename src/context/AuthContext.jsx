import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();   // <-- EXPORT AVAILABLE
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // 🔹 Hydrate initial state directly from localStorage so protected routes
  // don't briefly see "unauthenticated" on hard refresh / direct navigation.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  const [mfaVerified, setMfaVerified] = useState(() => {
    return localStorage.getItem("mfaVerified") === "true";
  });

  // Keep MFA flag consistent with access token if needed
  useEffect(() => {
    const access = localStorage.getItem("access");
    const storedMfa = localStorage.getItem("mfaVerified") === "true";

    if (access && !storedMfa) {
      setMfaVerified(false);
    }
  }, []);

  const login = (data) => {
    if (data.access) localStorage.setItem("access", data.access);
    if (data.refresh) localStorage.setItem("refresh", data.refresh);

    const userObj =
      data.user || (data.user_id ? { id: data.user_id, email: data.username } : null);

    if (userObj) {
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
    }

    const r = data.role || (userObj && userObj.role) || "user";
    setRole(r);
    localStorage.setItem("role", r);

    // Set MFA verified to true only if MFA is not required
    if (!data.mfa_required) {
      localStorage.setItem("mfaVerified", "true");
      setMfaVerified(true);
    }
  };

  const setMfaCompleted = () => {
    localStorage.setItem("mfaVerified", "true");
    setMfaVerified(true);
  };

  const updateUser = (userData) => {
    setUser((prev) => {
      const updated = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setMfaVerified(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, mfaVerified, login, logout, setMfaCompleted, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};