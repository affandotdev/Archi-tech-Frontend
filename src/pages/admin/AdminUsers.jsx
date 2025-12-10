import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, updateUserStatus, deleteUser } from '../../services/AdminService';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(searchTerm);

      // Handle both Array (standard) and Paginated Object (Django Rest Framework default)
      let rawData = [];
      if (Array.isArray(res.data)) {
        rawData = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        rawData = res.data.results;
      }

      // 🔥 Remove duplicate entries (fix your conflict)
      const unique = [];
      const map = new Map();
      for (const u of rawData) {
        const userId = u.id || u._id;
        if (userId && !map.has(userId)) {
          map.set(userId, true);
          // Ensure we have an 'id' property for the UI to use consistently
          unique.push({ ...u, id: userId });
        }
      }

      setUsers(unique);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentIsActive) => {
    const newIsActive = !currentIsActive;

    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, is_active: newIsActive } : u)
    );

    try {
      await updateUserStatus(userId, newIsActive);
    } catch (err) {
      console.error("Failed to update status", err);

      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, is_active: currentIsActive } : u)
      );
    }
  };

  // 🔥 DELETE USER HANDLER
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);

      // Remove from UI instantly
      setUsers(prev => prev.filter(u => u.id !== userId));

      // Refresh from backend to avoid mismatches
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === "all") return true;
    return user.role === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold text-indigo-300 tracking-[0.3em] mb-2">
              ADMIN • USERS
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              User directory
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              View accounts and their roles across the platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 text-sm font-semibold border border-slate-700 hover:bg-slate-800 transition-all duration-200"
            >
              Back
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl mb-6 w-fit border border-slate-800">
          {["all", "architect", "engineer", "client"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
            >
              {tab === "all"
                ? "All Users"
                : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-200">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-500 animate-pulse">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => (
                    <tr
                      key={u.id}
                      className={`transition-colors ${idx % 2 === 0
                        ? "bg-slate-900/60"
                        : "bg-slate-900/40"
                        } hover:bg-slate-800/50`}
                    >
                      <td className="px-6 py-3 whitespace-nowrap font-medium text-white">
                        {u.first_name} {u.last_name || ""}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-slate-300">
                        {u.email}
                      </td>

                      <td className="px-6 py-3 capitalize">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${u.role === "admin"
                            ? "bg-indigo-500/20 text-indigo-300"
                            : u.role === "architect"
                              ? "bg-blue-500/20 text-blue-300"
                              : u.role === "engineer"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-slate-700/50 text-slate-400"
                            }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${u.is_active
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                            : "bg-red-500/10 text-red-300 border-red-500/20"
                            }`}
                        >
                          {u.is_active ? "Active" : "Suspended"}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-right space-x-2">

                        <button
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleStatusToggle(u.id, u.is_active)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${u.is_active
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                        >
                          {u.is_active ? "Suspend" : "Activate"}
                        </button>

                        {/* 🔥 DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-colors"
                        >
                          Delete
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
