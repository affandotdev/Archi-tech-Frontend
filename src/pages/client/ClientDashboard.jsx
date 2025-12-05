import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/Logout Button";

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [activeProjects, setActiveProjects] = useState(3);
  const [pendingTasks, setPendingTasks] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    // In a real app, you would fetch user data from your API
    // For now, we'll simulate user data
    setUser({
      email: "client@example.com",
      firstName: "Jane",
      lastName: "Client",
      company: "Urban Development Corp",
      memberSince: "2024"
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ArchiTech
                    </span>
                    <span className="text-gray-300 ml-2">Client Portal</span>
                  </h1>
                  <p className="text-gray-400 text-xs">Project Management Suite</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-sm font-medium">ACTIVE SESSIONS</span>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-gray-800"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-gray-800"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-gray-800"></div>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="px-4 mb-8">
          <div className="bg-gradient-to-r from-gray-800/50 to-purple-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-3"></div>
                  <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">CLIENT PORTAL</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Welcome, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.firstName}</span>
                </h2>
                <p className="text-gray-300 font-light max-w-2xl">
                  Monitor your construction projects, review blueprints, and collaborate with your architectural team in real-time.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="mr-3">
                    <p className="text-gray-400 text-xs">Member Since</p>
                    <p className="text-white font-bold">{user?.memberSince}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-700/50 mx-3"></div>
                  <div>
                    <p className="text-gray-400 text-xs">Active Projects</p>
                    <p className="text-white font-bold">{activeProjects}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile & Info Card */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-700/50">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    PROJECT CLIENT PROFILE
                  </h3>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Client Information */}
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">CLIENT DETAILS</h4>
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Primary Contact</p>
                            <p className="text-white text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
                            <p className="text-gray-300 text-sm">{user?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-lg bg-pink-900/30 flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Organization</p>
                            <p className="text-white text-lg font-semibold">{user?.company}</p>
                            <p className="text-gray-300 text-sm">Project Sponsor</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">PROJECT OVERVIEW</h4>
                      <div className="space-y-4">
                        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Active Projects</span>
                            <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-lg text-sm font-medium">{activeProjects}</span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>

                        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Pending Reviews</span>
                            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-lg text-sm font-medium">{pendingTasks}</span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 pt-8 border-t border-gray-700/50">
                    <button
                      onClick={() => navigate("/client/projects")}
                      className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      ACCESS PROJECT LIBRARY
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Quick Actions & Resources */}
            <div>
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  QUICK ACTIONS
                </h3>

                {/* View profile */}
                <button
                  onClick={() => navigate("/client/profile")}
                  className="w-full flex items-center p-4 mb-3 bg-gray-800/40 hover:bg-gray-800/70 rounded-xl border border-blue-500/40 transition-all duration-300 group shadow-md shadow-blue-500/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-900/40 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium group-hover:text-cyan-300">
                      View Profile
                    </p>
                    <p className="text-gray-400 text-sm">
                      See and manage your client details
                    </p>
                  </div>
                </button>

                <div className="space-y-3 mb-8">
                  <button className="w-full flex items-center p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl border border-gray-700/30 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium group-hover:text-cyan-300">Review Documents</p>
                      <p className="text-gray-400 text-sm">Latest blueprints & specs</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl border border-gray-700/30 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium group-hover:text-cyan-300">Team Collaboration</p>
                      <p className="text-gray-400 text-sm">Connect with architects</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl border border-gray-700/30 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium group-hover:text-cyan-300">Budget Overview</p>
                      <p className="text-gray-400 text-sm">Financial tracking</p>
                    </div>
                  </button>
                </div>

                {/* Resources Section */}
                <div className="pt-6 border-t border-gray-700/50">
                  <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">RESOURCES</h4>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/30 transition-colors group">
                      <svg className="w-4 h-4 text-gray-400 mr-3 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span className="text-gray-300 group-hover:text-white text-sm">Download Project Templates</span>
                    </a>
                    <a href="#" className="flex items-center p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/30 transition-colors group">
                      <svg className="w-4 h-4 text-gray-400 mr-3 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <span className="text-gray-300 group-hover:text-white text-sm">Schedule Site Visit</span>
                    </a>
                  </div>
                </div>

                {/* Support Card */}
                <div className="mt-8 p-4 bg-gradient-to-r from-gray-800/50 to-blue-900/30 rounded-xl border border-gray-700/30">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Need Assistance?</p>
                      <p className="text-gray-300 text-sm">Connect with your project manager</p>
                    </div>
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