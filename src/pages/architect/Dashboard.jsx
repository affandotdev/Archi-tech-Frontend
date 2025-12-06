import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/Logout Button";
import { useAuth } from "../../context/AuthContext";

export default function ArchitectDashboard() {
  const { user: authUser, role } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [activeProjects] = useState(4);
  const [pendingReviews] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    // Verify user has the correct role
    if (role !== "architect") {
      // Redirect to appropriate dashboard based on actual role
      if (role === "engineer") navigate("/engineer/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/client/dashboard");
      return;
    }

    // Simulate MFA flag (would come from API in real app)
    setMfaEnabled(false);
  }, [navigate, role]);

  const handleEnableMFA = () => {
    navigate("/mfa-setup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900">
      {/* Top nav */}
      <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-slate-950"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                    d="M4 21l8-18 8 18M9 17h6"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                    ArchiTech
                  </span>
                  <span className="text-slate-300 ml-2">Architect Studio</span>
                </h1>
                <p className="text-slate-400 text-xs">
                  Design, coordinate, and deliver projects in one place.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end text-xs text-slate-400">
                <span className="uppercase tracking-[0.2em] text-sky-300">
                  Signed in as
                </span>
                <span className="text-sm text-slate-100 font-medium">
                  {authUser ? (authUser.firstName && authUser.lastName ? `${authUser.firstName} ${authUser.lastName}` : authUser.email?.split("@")[0] || "Architect") : "Architect"}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="px-4 mb-8">
          <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/70 to-sky-900/40 backdrop-blur-xl rounded-2xl p-7 md:p-8 border border-slate-800/70 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-sky-300 tracking-[0.3em] mb-2">
                  ARCHITECT DASHBOARD
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Good day,{" "}
                  <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                    {authUser?.firstName || authUser?.email?.split("@")[0] || "Architect"}
                  </span>
                </h2>
                <p className="text-slate-300 text-sm md:text-base max-w-2xl">
                  Track drawings, coordinate with engineers and clients, and keep
                  every project on schedule from a single workspace.
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-700/70">
                  <div className="mr-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Active Projects
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {activeProjects}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-slate-700/70 mx-3" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Reviews Pending
                    </p>
                    <p className="text-lg font-semibold text-sky-300">
                      {pendingReviews}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/client/dashboard")}
                  className="text-xs text-sky-300 hover:text-white underline-offset-2 hover:underline"
                >
                  Switch to client view
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Left: profile + security */}
            <div className="lg:col-span-2 space-y-7">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300">
                    PROFILE & PRACTICE
                  </h3>
                  <span className="text-xs text-slate-400">
                    {authUser?.studio || "Independent Architect"}
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/30 to-cyan-400/20 flex items-center justify-center">
                      <span className="text-xl font-semibold text-sky-200">
                        {authUser?.firstName
                          ? authUser.firstName.charAt(0).toUpperCase()
                          : authUser?.email?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        Signed-in architect
                      </p>
                      <p className="text-base font-semibold text-white">
                        {authUser
                          ? (authUser.firstName && authUser.lastName 
                              ? `${authUser.firstName} ${authUser.lastName}`
                              : authUser.email?.split("@")[0] || "Architect User")
                          : "Architect User"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {authUser?.email || "architect@example.com"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Two‑Factor Authentication
                      </span>
                      {mfaEnabled ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          Enabled
                        </span>
                      ) : (
                        <button
                          onClick={handleEnableMFA}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-sky-600 text-white hover:bg-sky-500 transition-colors"
                        >
                          Enable MFA
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Protect access to drawings and client data by enabling
                      two‑factor authentication on your account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl p-6">
                <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300 mb-4">
                  PIPELINE
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
                    <p className="text-slate-400 text-xs mb-1">Concept</p>
                    <p className="text-2xl font-semibold text-white">3</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Early‑stage massing & zoning checks.
                    </p>
                  </div>
                  <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
                    <p className="text-slate-400 text-xs mb-1">Design Dev.</p>
                    <p className="text-2xl font-semibold text-white">5</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Coordination with engineers in progress.
                    </p>
                  </div>
                  <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
                    <p className="text-slate-400 text-xs mb-1">On‑site</p>
                    <p className="text-2xl font-semibold text-white">2</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Active construction with daily updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: quick actions */}
            <div className="space-y-6">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl p-6">
                <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300 mb-5 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  QUICK ACTIONS
                </h3>

                <div className="space-y-3">
                  <button className="w-full flex items-center p-4 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all duration-200 group">
                    <div className="w-10 h-10 rounded-lg bg-sky-900/40 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-5 h-5 text-sky-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4 6h16M4 12h10M4 18h6"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white font-medium group-hover:text-sky-200">
                        Open project board
                      </p>
                      <p className="text-xs text-slate-400">
                        Manage briefs, drawings, and deadlines.
                      </p>
                    </div>
                  </button>

                  <button className="w-full flex items-center p-4 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all duration-200 group">
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
                          d="M7 8h10M7 12h6m-6 4h3M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-4-3-4 3-4-3-4 3V5z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white font-medium group-hover:text-emerald-200">
                        Share latest drawings
                      </p>
                      <p className="text-xs text-slate-400">
                        Upload PDFs for engineers & clients.
                      </p>
                    </div>
                  </button>

                  <button className="w-full flex items-center p-4 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all duration-200 group">
                    <div className="w-10 h-10 rounded-lg bg-amber-900/40 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-5 h-5 text-amber-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white font-medium group-hover:text-amber-200">
                        Schedule coordination
                      </p>
                      <p className="text-xs text-slate-400">
                        Set up a session with engineers and client.
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