import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyMFA } from "../../services/auth";

export default function MFAVerify() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await verifyMFA(token);
      setMessage("MFA enabled successfully! Redirecting to dashboard...");
      // Get user role from localStorage
      const role = localStorage.getItem("role");
      setTimeout(() => {
        if (role === 'architect') {
          navigate("/architect/dashboard");
        } else if (role === 'engineer') {
          navigate("/engineer/dashboard");
        } else if (role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          // Default to client dashboard
          navigate("/client/dashboard");
        }
      }, 2000);
    } catch (err) {
      console.error("MFA verification failed:", err);
      setError(err.response?.data?.message || "Invalid token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Verify Two-Factor Authentication
        </h2>
        
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit code from your authenticator app
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              maxLength="6"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || token.length !== 6}
            className={`w-full py-3 font-semibold text-white rounded-lg transition ${
              loading || token.length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify and Enable MFA"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <p className="mt-4 text-center text-gray-600">
          <a href="/dashboard" className="text-blue-600 font-medium hover:underline">
            Skip for now
          </a>
        </p>
      </div>
    </div>
  );
}