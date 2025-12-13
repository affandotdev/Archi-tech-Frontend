import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminProfessionRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Admin Portal
                    </span>
                    <span className="text-gray-300 ml-2">Profession Requests</span>
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Pending Approvals</h2>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">Total: {requests.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/60 rounded-2xl border border-gray-700/50">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">No pending profession requests found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div key={req.id} className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-xl flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mr-3 ${req.requested_role === 'architect' ? 'bg-purple-900/50 text-purple-400 border border-purple-700' : 'bg-orange-900/50 text-orange-400 border border-orange-700'
                      }`}>
                      {req.requested_role}
                    </span>
                    <span className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{req.user_email}</h3>
                  <a
                    href={req.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center mt-2 group"
                  >
                    <svg className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    View Submitted Document
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => reject(req.id)}
                        className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approve(req.id)}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105"
                      >
                        Approve Request
                      </button>
                    </>
                  ) : (
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${req.status === 'approved'
                      ? 'bg-green-900/20 text-green-400 border border-green-800'
                      : 'bg-red-900/20 text-red-400 border border-red-800'
                      }`}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
