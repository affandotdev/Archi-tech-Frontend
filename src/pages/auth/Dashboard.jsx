import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout Button";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    // In a real app, you would fetch user data from your API
    // For now, we'll simulate user data
    setUser({
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe"
    });

    // Check if MFA is enabled (in a real app, this would come from the API)
    // For now, we'll simulate this
    setMfaEnabled(false);
  }, [navigate]);

  const handleEnableMFA = () => {
    navigate("/mfa-setup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ArchiTech<span className="text-gray-300"> Pro</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="px-4 mb-8">
          <div className="bg-gradient-to-r from-gray-800/50 to-blue-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome to the <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Construction Site</span>
                </h2>
                <p className="text-gray-300 font-light">
                  Project Dashboard • {user?.firstName} {user?.lastName} • Site Supervisor
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 text-sm">SYSTEM ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main User Card */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Site Credentials
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Your project access information
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-blue-900/30 rounded-lg border border-blue-700/30">
                      <span className="text-blue-300 text-sm font-medium">ACTIVE</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  {/* User Info */}
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center border border-blue-500/30 mr-4">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Site Operator</p>
                        <p className="text-white text-xl font-semibold">
                          {user?.firstName} {user?.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Site Communication</p>
                            <p className="text-white font-medium">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-lg bg-cyan-900/30 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Site Security</p>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">Access Control</span>
                              {mfaEnabled ? (
                                <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-sm border border-green-700/30">
                                  ACTIVE
                                </span>
                              ) : (
                                <button
                                  onClick={handleEnableMFA}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                                >
                                  Enable 2FA
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div>
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Site Status</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Site Access Level</span>
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-medium">PRO</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Data Encryption</span>
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-medium">256-bit</span>
                    </div>
                    <p className="text-white text-sm">All project data is securely encrypted</p>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Last Access</span>
                      <span className="text-gray-300 text-sm">Just now</span>
                    </div>
                    <p className="text-white text-sm">From secure location • Verified</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <h4 className="text-gray-400 text-sm mb-4">QUICK ACTIONS</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl border border-gray-700/30 transition-colors group">
                      <span className="text-gray-300 group-hover:text-white">Project Settings</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl border border-gray-700/30 transition-colors group">
                      <span className="text-gray-300 group-hover:text-white">Team Members</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}