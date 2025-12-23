import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import StatsCard from "../../widgets/DashboardWidgets/StatsCard";
import QuickActions from "../../widgets/DashboardWidgets/QuickActions";
import Card from "../../shared/components/Card";

export default function ArchitectDashboard() {
  const { user: authUser, role } = useAuth();
  const [activeProjects] = useState(4);
  const [pendingReviews] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (role !== "architect") {
      if (role === "engineer") navigate("/engineer/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/client/dashboard");
      return;
    }
  }, [navigate, role]);

  const actions = [
    {
      label: "Project Board",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h10M4 18h6" />
        </svg>
      ),
      onClick: () => navigate("/architect/projects"),
    },
    {
      label: "Share Drawings",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h6m-6 4h3M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-4-3-4 3-4 3-4 3V5z" />
        </svg>
      ),
      onClick: () => navigate("/architect/drawings"),
    },
    {
      label: "Add 3D Project",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      onClick: () => navigate("/portfolio/upload"),
    },
    {
      label: "Schedule",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => navigate("/architect/schedule"),
    },
    {
      label: "My Profile",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => navigate("/architect/profile"),
    },
    {
      label: "My 3D Portfolio",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      onClick: () => {
        const userStr = localStorage.getItem("user");
        const uid = userStr ? JSON.parse(userStr).id : null;
        if (uid) navigate(`/portfolio/list/${uid}`);
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Architect Studio" user={authUser} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Good day, {authUser?.firstName || "Architect"}
          </h2>
          <p className="text-slate-500 mt-2">
            Manage your design pipeline and coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Active Projects"
            value={activeProjects}
            color="sky"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatsCard
            title="Pending Reviews"
            value={pendingReviews}
            color="indigo"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            }
          />
          <Card className="flex items-center justify-between bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-none">
            <div>
              <p className="text-sky-100 text-sm font-medium uppercase tracking-wider mb-1">Studio</p>
              <p className="text-lg font-bold">{authUser?.studio || "Independent"}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <QuickActions title="Quick Actions" actions={actions} />

            <Card title="Project Pipeline">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Concept</p>
                  <p className="text-2xl font-bold text-slate-800">3</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Development</p>
                  <p className="text-2xl font-bold text-slate-800">5</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Construction</p>
                  <p className="text-2xl font-bold text-slate-800">2</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {/* Optional Sidebar or Feed */}
            <Card title="Notifications">
              <p className="text-slate-500 text-center py-4 text-sm">No new alerts</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}