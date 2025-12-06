import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/Logout Button";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user: authUser, role } = useAuth();
  const [stats] = useState({
    totalUsers: 128,
    activeSessions: 23,
    openIncidents: 2,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    // Verify user has the correct role
    if (role !== "admin") {
      // Redirect to appropriate dashboard based on actual role
      if (role === "architect") navigate("/architect/dashboard");
      else if (role === "engineer") navigate("/engineer/dashboard");
      else navigate("/client/dashboard");
      return;
    }
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900">
      {/* Top nav */}
      <nav className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/70 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-slate-950"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  <span className="bg-gradient-to-r from-indigo-300 to-violet-200 bg-clip-text text-transparent">
                    ArchiTech
                  </span>
                  <span className="text-slate-300 ml-2">Admin Console</span>
                </h1>
                <p className="text-slate-400 text-xs">
                  Monitor users, roles, and platform health.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end text-xs text-slate-400">
                <span className="uppercase tracking-[0.2em] text-indigo-300">
                  Administrator
                </span>
                <span className="text-sm text-slate-100 font-medium">
                  {authUser ? (authUser.firstName && authUser.lastName ? `${authUser.firstName} ${authUser.lastName}` : authUser.email?.split("@")[0] || "Admin") : "Admin"}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Welcome + stats */}
        <div className="px-4 mb-8">
          <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/70 to-indigo-900/40 backdrop-blur-xl rounded-2xl p-7 md:p-8 border border-slate-800/70 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-indigo-300 tracking-[0.3em] mb-2">
                  ADMIN DASHBOARD
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-indigo-300 to-violet-200 bg-clip-text text-transparent">
                    {authUser?.firstName || authUser?.email?.split("@")[0] || "Admin"}
                  </span>
                </h2>
                <p className="text-slate-300 text-sm md:text-base max-w-2xl">
                  Get a quick overview of users, roles, and system activity, and
                  jump straight into management tools.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3">
                  <p className="text-slate-400 mb-1">Total Users</p>
                  <p className="text-xl font-semibold text-white">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3">
                  <p className="text-slate-400 mb-1">Active Sessions</p>
                  <p className="text-xl font-semibold text-indigo-300">
                    {stats.activeSessions}
                  </p>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3">
                  <p className="text-slate-400 mb-1">Open Incidents</p>
                  <p className="text-xl font-semibold text-amber-300">
                    {stats.openIncidents}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Left: account + quick links */}
            <div className="lg:col-span-2 space-y-7">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/80">
                  <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300">
                    ACCOUNT
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Name</p>
                    <p className="text-base font-semibold text-white">
                      {authUser
                        ? (authUser.firstName && authUser.lastName
                            ? `${authUser.firstName} ${authUser.lastName}`
                            : authUser.email?.split("@")[0] || "Admin User")
                        : "Admin User"}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Email</p>
                    <p className="text-sm text-slate-200">{authUser?.email || "admin@example.com"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-2">
                      Admin shortcuts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate("/admin/users")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                      >
                        Manage users
                      </button>
                      <button
                        onClick={() => navigate("/admin/settings")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                      >
                        Platform settings
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-3">
                      Use the shortcuts to quickly open user management or global
                      configuration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl p-6">
                <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300 mb-4">
                  SYSTEM OVERVIEW
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
                    <p className="text-slate-400 mb-1">Auth Service</p>
                    <p className="text-emerald-300 font-semibold">Healthy</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Last check: 2 min ago.
                    </p>
                  </div>
                  <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
                    <p className="text-slate-400 mb-1">User Service</p>
                    <p className="text-emerald-300 font-semibold">Healthy</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Syncs profiles and roles.
                    </p>
                  </div>
                  <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
                    <p className="text-slate-400 mb-1">Notifications</p>
                    <p className="text-amber-300 font-semibold">Minor delays</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Queues clearing normally.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: management tiles */}
            <div className="space-y-6">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl p-6">
                <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300 mb-5">
                  MANAGEMENT
                </h3>
                <div className="space-y-3 text-sm">
                  <button
                    onClick={() => navigate("/admin/users")}
                    className="w-full flex items-center p-4 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-900/40 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-5 h-5 text-indigo-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 19h5v-2a3 3 0 00-5.356-1.857M9 19H4v-2a3 3 0 015.356-1.857M12 12a3 3 0 100-6 3 3 0 000 6z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium group-hover:text-indigo-200">
                        User directory
                      </p>
                      <p className="text-xs text-slate-400">
                        View accounts, roles, and statuses.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/admin/settings")}
                    className="w-full flex items-center p-4 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-900/40 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-5 h-5 text-emerald-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M10.325 4.317a1 1 0 011.35-.937l.39.13a1 1 0 00.949-.17l.518-.414a1 1 0 011.31.083l1.414 1.414a1 1 0 01.083 1.31l-.414.518a1 1 0 00-.17.949l.13.39a1 1 0 01-.937 1.35l-.403.054a1 1 0 00-.89.89l-.054.403a1 1 0 01-1.35.937l-.39-.13a1 1 0 00-.949.17l-.518.414a1 1 0 01-1.31-.083L7.05 16.95a1 1 0 01-.083-1.31l.414-.518a1 1 0 00.17-.949l-.13-.39a1 1 0 01.937-1.35l.403-.054a1 1 0 00.89-.89l.054-.403z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium group-hover:text-emerald-200">
                        Platform configuration
                      </p>
                      <p className="text-xs text-slate-400">
                        Control security and default settings.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}