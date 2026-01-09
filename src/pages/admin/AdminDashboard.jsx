import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStats, getSystemHealth, getDailyReports } from "../../services/AdminService";
import Navbar from "../../widgets/Navbar/Navbar";
import StatsCard from "../../widgets/DashboardWidgets/StatsCard";
import QuickActions from "../../widgets/DashboardWidgets/QuickActions";
import RecentActivities from "../../widgets/DashboardWidgets/RecentActivities";
import DailyReportChart from "../../widgets/DashboardWidgets/DailyReportChart";

export default function AdminDashboard() {
  const { user: authUser, role } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    openIncidents: 0,
  });
  const [health, setHealth] = useState(null);
  const [reports, setReports] = useState([]); // [NEW] State for reports
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (role !== "admin") {
      if (role === "architect") navigate("/architect/dashboard");
      else if (role === "engineer") navigate("/engineer/dashboard");
      else navigate("/client/dashboard");
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, healthRes] = await Promise.all([
          getDashboardStats(),
          getSystemHealth(),
        ]);

        setStats({
          totalUsers: statsRes.data.totalUsers || statsRes.data.total_users || 0,
          activeSessions: statsRes.data.activeSessions || statsRes.data.active_sessions || 0,
          openIncidents: statsRes.data.openIncidents || statsRes.data.open_incidents || 0,
        });
        setHealth(healthRes.data);
        setReports([]);
      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate, role]);

  const quickActions = [
    {
      label: "User Directory",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19h5v-2a3 3 0 00-5.356-1.857M9 19H4v-2a3 3 0 015.356-1.857M12 12a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
      onClick: () => navigate("/admin/users"),
    },
    {
      label: "Platform Config",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317a1 1 0 011.35-.937l.39.13a1 1 0 00.949-.17l.518-.414a1 1 0 011.31.083l1.414 1.414a1 1 0 01.083 1.31l-.414.518a1 1 0 00-.17.949l.13.39a1 1 0 01-.937 1.35l-.403.054a1 1 0 00.89-.89l.054-.403a1 1 0 01-1.35.937l-.39-.13a1 1 0 00-.949.17l-.518.414a1 1 0 01-1.31-.083L7.05 16.95a1 1 0 01-.083-1.31l.414-.518a1 1 0 00.17-.949l-.13-.39a1 1 0 01.937-1.35l.403-.054a1 1 0 00.89-.89l.054-.403z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: () => navigate("/admin/settings"),
    },
    {
      label: "Profession Requests",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => navigate("/admin/profession-requests"),
    },
  ];

  const systemHealthActivities = health ? [
    {
      title: "Auth Service",
      time: "Just now",
      description: `Status: ${health.auth || "Unknown"}`,
      icon: <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
      title: "User Service",
      time: "Just now",
      description: `Status: ${health.user || "Unknown"} - Syncs profiles roles.`,
      icon: <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
    {
      title: "Notifications",
      time: "Just now",
      description: `Status: ${health.notifications || "Operational"} - Queues active.`,
      icon: <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    }
  ] : [];


  // ... (rest of the code)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Admin Console" user={authUser} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Welcome back, {(authUser?.full_name || authUser?.first_name || authUser?.firstName || "Admin").split(" ")[0]}
          </h2>
          <p className="text-slate-500 mt-2">
            Overview of system performance and user activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            color="indigo"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Active Sessions"
            value={stats.activeSessions}
            color="emerald"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Open Incidents"
            value={stats.openIncidents}
            color="rose"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <DailyReportChart data={reports} /> {/* [NEW] Render Chart */}
            <QuickActions title="Admin Management" actions={quickActions} />
          </div>


          {/* Sidebar / Feed Area */}
          <div className="lg:col-span-1">
            <RecentActivities activities={systemHealthActivities} />
          </div>
        </div>
      </div>
    </div>
  );
}