import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import StatsCard from "../../widgets/DashboardWidgets/StatsCard";
import QuickActions from "../../widgets/DashboardWidgets/QuickActions";
import RecentActivities from "../../widgets/DashboardWidgets/RecentActivities";
import Card from "../../shared/components/Card";

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

    if (role && role !== "engineer") {
      if (role === "architect") navigate("/architect/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else if (role === "client" || role === "user") navigate("/client/dashboard");
      return;
    }
  }, [navigate, role]);

  const actions = [
    {
      label: "Task List",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 12h18M3 17h12" />
        </svg>
      ),
      onClick: () => navigate("/engineer/tasks"),
    },
    {
      label: "Calculations",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 12h4m4 0h10M3 17h10" />
        </svg>
      ),
      onClick: () => navigate("/engineer/calculations"),
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
      label: "My Profile",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => navigate("/engineer/profile"),
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

  const priorities = [
    {
      title: "Review load calculations",
      time: "Due Today",
      description: "Tower B podium slab analysis from Skyline Design Studio.",
      icon: <span className="w-3 h-3 rounded-full bg-amber-400"></span>
    },
    {
      title: "Respond to RFI #32",
      time: "Due Today",
      description: "Clarification on column baseplate detail needed by Site Team.",
      icon: <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Engineer Console" user={authUser} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Hello, {authUser?.firstName || "Engineer"}
          </h2>
          <p className="text-slate-500 mt-2">
            Coordinate structural checks and site status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Open Issues"
            value={openIssues}
            color="rose"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Active Sites"
            value={sites}
            color="emerald"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <Card className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none">
            <div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-1">Discipline</p>
              <p className="text-lg font-bold">{authUser?.discipline || "Structural"}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <QuickActions title="Engineering Actions" actions={actions} />

            <Card title="Workload Distribution">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-slate-600">
                    <span>Design checks</span>
                    <span className="font-medium">70%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500 w-[70%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 text-slate-600">
                    <span>Site queries</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-rose-400 w-[40%]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <RecentActivities activities={priorities} />
          </div>
        </div>
      </div>
    </div>
  );
}
