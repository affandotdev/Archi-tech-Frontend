import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminProfessionRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("pending"); // "pending" | "all"

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/auth/admin/profession-requests/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
          }
        }
      );
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await axios.post(
        `http://localhost:8000/api/auth/admin/profession-request/${id}/approve/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
          }
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Failed to approve", error);
      alert("Failed to approve request");
    }
  };

  const reject = async (id) => {
    try {
      await axios.post(
        `http://localhost:8000/api/auth/admin/profession-request/${id}/reject/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
          }
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Failed to reject", error);
      alert("Failed to reject request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = selectedTab === "pending" 
    ? requests.filter(req => req.status === "pending")
    : requests;

  const stats = {
    total: requests.length,
    pending: requests.filter(req => req.status === "pending").length,
    approved: requests.filter(req => req.status === "approved").length,
    rejected: requests.filter(req => req.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-800">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Admin Portal
                    </span>
                    <span className="text-slate-600 ml-2">Profession Requests</span>
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
              >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Approved</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-rose-600">{stats.rejected}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Profession Requests</h2>
            <p className="text-slate-600 mt-2">Review and manage professional role applications</p>
          </div>
          
          <div className="flex space-x-2 bg-white rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setSelectedTab("pending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "pending"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "all"
                  ? "bg-slate-100 text-slate-800"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              All Requests
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
              </div>
            </div>
            <p className="mt-4 text-slate-600">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No requests found</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {selectedTab === "pending" 
                ? "All pending requests have been processed. Check back later for new submissions."
                : "No profession requests have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        req.requested_role === 'architect' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-orange-100 text-orange-700 border border-orange-200'
                      }`}>
                        {req.requested_role}
                      </span>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === 'pending' 
                          ? 'bg-amber-100 text-amber-700'
                          : req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {req.status}
                      </span>
                      
                      <span className="text-slate-500 text-sm">
                        {new Date(req.created_at || new Date()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">{req.user_email}</h3>
                      <p className="text-slate-600 text-sm">
                        Requesting <span className="font-medium">{req.requested_role}</span> role
                      </p>
                    </div>
                    
                    {req.document && (
                      <a
                        href={req.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Qualification Document
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {req.status === "pending" ? (
                      <>
                        <button
                          onClick={() => reject(req.id)}
                          className="px-5 py-2.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => approve(req.id)}
                          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
                        >
                          Approve
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {req.status === 'approved' ? 'Request approved' : 'Request rejected'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredRequests.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
            <p>Showing {filteredRequests.length} of {requests.length} requests</p>
            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}