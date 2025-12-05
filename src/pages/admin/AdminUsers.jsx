import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const navigate = useNavigate();

  // Static demo data – in a real app this would come from an API
  const users = [
    { id: 1, name: "John Architect", email: "architect@example.com", role: "architect", status: "Active" },
    { id: 2, name: "Emma Engineer", email: "engineer@example.com", role: "engineer", status: "Active" },
    { id: 3, name: "Clara Client", email: "client@example.com", role: "client", status: "Invited" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
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
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 text-sm font-semibold border border-slate-700 hover:bg-slate-800 transition-all duration-200"
          >
            Back to dashboard
          </button>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-200">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-900/40"}
                  >
                    <td className="px-6 py-3 whitespace-nowrap">{u.name}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-slate-300">
                      {u.email}
                    </td>
                    <td className="px-6 py-3 capitalize">{u.role}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          u.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


