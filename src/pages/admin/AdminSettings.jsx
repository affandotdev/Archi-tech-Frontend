import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    mfaRequired: true,
    skipMfa: true,
    emailRegistration: true,
    emailIncident: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    setSuccess(true);

    // Hide success message after 3s
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
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

        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-6 py-4 rounded-xl flex items-center animate-fade-in-down">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Settings saved successfully.
          </div>
        )}

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
                <div
                  onClick={() => handleToggle('mfaRequired')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${settings.mfaRequired ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${settings.mfaRequired ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p>Allow &quot;skip MFA&quot; for 24 hours</p>
                  <p className="text-xs text-slate-500">
                    Users can trust their device and skip MFA temporarily.
                  </p>
                </div>
                <div
                  onClick={() => handleToggle('skipMfa')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${settings.skipMfa ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${settings.skipMfa ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
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
                <div
                  onClick={() => handleToggle('emailRegistration')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${settings.emailRegistration ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${settings.emailRegistration ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p>Send email on system incident</p>
                  <p className="text-xs text-slate-500">
                    Get notified when any microservice reports an error.
                  </p>
                </div>
                <div
                  onClick={() => handleToggle('emailIncident')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${settings.emailIncident ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${settings.emailIncident ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${saving
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
                }`}
            >
              {saving ? "Saving Changes..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


