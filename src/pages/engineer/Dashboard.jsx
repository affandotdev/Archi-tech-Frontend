import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/Logout Button";
import { useAuth } from "../../context/AuthContext";

export default function EngineerDashboard() {
  const { user: authUser, role } = useAuth();
  const [openIssues] = useState(5);
  const [sites] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    // Verify user has the correct role (only redirect if role is set and doesn't match)
    if (role && role !== "engineer") {
      // Redirect to appropriate dashboard based on actual role
      if (role === "architect") navigate("/architect/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else if (role === "client" || role === "user") navigate("/client/dashboard");
      return;
    }
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900">
      {/* Top nav */}
      <nav className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/70 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
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
                    d="M4 7h16M4 12h16M4 17h10"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  <span className="bg-gradient-to-r from-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                    ArchiTech
                  </span>
                  <span className="text-slate-300 ml-2">Engineer Console</span>
                </h1>
                <p className="text-slate-400 text-xs">
                  Coordinate structural checks and site status.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end text-xs text-slate-400">
                <span className="uppercase tracking-[0.2em] text-emerald-300">
                  Engineer
                </span>
                <span className="text-sm text-slate-100 font-medium">
                  {authUser ? (authUser.firstName && authUser.lastName ? `${authUser.firstName} ${authUser.lastName}` : authUser.email?.split("@")[0] || "Engineer") : "Engineer"}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 mb-8">
          <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/70 to-emerald-900/40 backdrop-blur-xl rounded-2xl p-7 md:p-8 border border-slate-800/70 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-emerald-300 tracking-[0.3em] mb-2">
                  ENGINEER DASHBOARD
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Hello,{" "}
                  <span className="bg-gradient-to-r from-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                    {authUser?.firstName || authUser?.email?.split("@")[0] || "Engineer"}
                  </span>
                </h2>
                <p className="text-slate-300 text-sm md:text-base max-w-2xl">
                  Review structural tasks, track site progress, and respond to
                  architect and client queries from one view.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3">
                  <p className="text-slate-400 mb-1">Open Issues</p>
                  <p className="text-xl font-semibold text-amber-300">
                    {openIssues}
                  </p>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3">
                  <p className="text-slate-400 mb-1">Active Sites</p>
                  <p className="text-xl font-semibold text-emerald-300">
                    {sites}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Left: profile + workload */}
            <div className="lg:col-span-2 space-y-7">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/80">
                  <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300">
                    PROFILE
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Name</p>
                    <p className="text-base font-semibold text-white">
                      {authUser
                        ? (authUser.firstName && authUser.lastName
                            ? `${authUser.firstName} ${authUser.lastName}`
                            : authUser.email?.split("@")[0] || "Engineer User")
                        : "Engineer User"}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Discipline</p>
                    <p className="text-sm text-slate-200">
                      {authUser?.discipline || "Engineering"}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Email</p>
                    <p className="text-sm text-slate-200">{authUser?.email || "engineer@example.com"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Workload</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                          <span>Design checks</span>
                          <span>70%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 w-[70%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                          <span>Site queries</span>
                          <span>40%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className="h-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-300 w-[40%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl p-6">
                <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300 mb-4">
                  TODAY&apos;S PRIORITIES
                </h3>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-amber-400" />
                    <div>
                      <p>Review load calculations for Tower B podium slab.</p>
                      <p className="text-xs text-slate-500">
                        From: Skyline Design Studio • Due: Today
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <p>Respond to RFI #32 – column baseplate detail.</p>
                      <p className="text-xs text-slate-500">
                        From: Site Team • Due: Today
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: quick actions */}
            <div className="space-y-6">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl p-6">
                <h3 className="text-sm font-semibold tracking-[0.25em] text-slate-300 mb-5">
                  QUICK ACTIONS
                </h3>
                <div className="space-y-3 text-sm">
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
                          d="M3 7h18M3 12h18M3 17h12"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium group-hover:text-emerald-200">
                        View assignment list
                      </p>
                      <p className="text-xs text-slate-400">
                        See all current engineering tasks.
                      </p>
                    </div>
                  </button>

                  <button className="w-full flex items-center p-4 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all duration-200 group">
                    <div className="w-10 h-10 rounded-lg bg-cyan-900/40 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-5 h-5 text-cyan-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 7h18M3 12h4m4 0h10M3 17h10"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium group-hover:text-cyan-200">
                        Upload calculation sheets
                      </p>
                      <p className="text-xs text-slate-400">
                        Share PDFs with architects and clients.
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


