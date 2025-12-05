import React, { useState, useEffect } from "react";
import { resetPassword } from "../../services/auth";

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Get email from localStorage
    const resetEmail = localStorage.getItem("reset_email");
    if (resetEmail) {
      setForm(prev => ({ ...prev, email: resetEmail }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (form.new_password !== form.confirm_password) {
      setError("Security keys do not match");
      return;
    }
    
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      await resetPassword({ email: form.email, otp: form.otp, new_password: form.new_password });
      setMessage("Site access restored! Redirecting to secure login...");
      // Clear reset email from localStorage
      localStorage.removeItem("reset_email");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Security protocol failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 px-4">
      <div className="relative backdrop-blur-xl bg-gray-900/60 shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-cyan-500/20 overflow-hidden">
        {/* Security pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(6, 182, 212, 0.2) 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 mb-4">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                SECURE ACCESS RESET
              </span>
            </h2>
            <p className="text-gray-400 font-light">
              Redeploy your site security credentials
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                name="otp"
                type="text"
                placeholder="Recovery Code (OTP)"
                required
                value={form.otp}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-3.5 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <input
                name="new_password"
                type="password"
                placeholder="New Security Key"
                required
                value={form.new_password}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-3.5 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <input
                name="confirm_password"
                type="password"
                placeholder="Confirm Security Key"
                required
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-3.5 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  REDEPLOYING SECURITY...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  SECURE & REDEPLOY
                </span>
              )}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-700/30 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-green-300">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-700/30 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-gray-400">
            Remember your security protocol?{" "}
            <a href="/login" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline transition-colors">
              Access Secure Site
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}