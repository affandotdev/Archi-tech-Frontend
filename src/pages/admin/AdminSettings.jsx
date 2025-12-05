import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-indigo-300 tracking-[0.3em] mb-2">
              ADMIN • SETTINGS
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Platform settings
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure security defaults and global options.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 text-sm font-semibold border border-slate-700 hover:bg-slate-800 transition-all duration-200"
          >
            Back to dashboard
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <h2 className="text-sm font-semibold tracking-[0.25em] text-slate-300 mb-4">
              SECURITY
            </h2>
            <div className="space-y-4 text-sm text-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p>Require MFA for all admins</p>
                  <p className="text-xs text-slate-500">
                    Strongly recommended to protect sensitive controls.
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4 mt-1" defaultChecked />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p>Allow &quot;skip MFA&quot; for 24 hours</p>
                  <p className="text-xs text-slate-500">
                    Users can trust their device and skip MFA temporarily.
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4 mt-1" defaultChecked />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <h2 className="text-sm font-semibold tracking-[0.25em] text-slate-300 mb-4">
              NOTIFICATIONS
            </h2>
            <div className="space-y-4 text-sm text-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p>Send email on new user registration</p>
                  <p className="text-xs text-slate-500">
                    Receive alerts when new accounts are created.
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4 mt-1" defaultChecked />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p>Send email on system incident</p>
                  <p className="text-xs text-slate-500">
                    Get notified when any microservice reports an error.
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4 mt-1" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


