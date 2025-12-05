// src/pages/auth/MFALoginVerify.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { verifyMFA } from "../../services/auth";
import { AuthContext } from "../../context/AuthContext";

export default function MFALoginVerify() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, setMfaCompleted } = useContext(AuthContext);

  useEffect(() => {
    const pendingUserId = localStorage.getItem("pending_user_id");
    if (!pendingUserId) navigate("/login");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const pendingUserId = localStorage.getItem("pending_user_id");

      const res = await verifyMFA({
        token,
        user_id: pendingUserId,
      });

      login(res.data); // Save access, refresh, user, role
      setMfaCompleted();

      localStorage.removeItem("pending_user_id");

      setMessage("MFA verified! Redirecting...");

      const role = res.data.role;

      setTimeout(() => {
        if (role === "architect") navigate("/architect/dashboard");
        else if (role === "engineer") navigate("/engineer/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else navigate("/client/dashboard");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid token.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    const access = localStorage.getItem("access");
    if (!access) return alert("Cannot skip — login provided no tokens");

    setMfaCompleted();

    const role =
      localStorage.getItem("role") ||
      JSON.parse(localStorage.getItem("user"))?.role;

    if (role === "architect") navigate("/architect/dashboard");
    else if (role === "engineer") navigate("/engineer/dashboard");
    else if (role === "admin") navigate("/admin/dashboard");
    else navigate("/client/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Two-Factor Verification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading || token.length !== 6}
            className={`w-full py-3 font-semibold text-white rounded-lg transition ${
              loading || token.length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {message && (
          <p className="mt-3 p-3 bg-green-100 text-green-700 rounded">{message}</p>
        )}

        {error && (
          <p className="mt-3 p-3 bg-red-100 text-red-700 rounded">{error}</p>
        )}

        <button
          onClick={handleSkip}
          className="mt-5 w-full text-blue-600 font-medium hover:underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}