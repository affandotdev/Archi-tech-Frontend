import React, { useState } from "react";
import { registerUser } from "../../services/auth";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "client",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setLoading(true);

    try {
      await registerUser(form);
      alert("Registered successfully! Check your email for OTP.");
      window.location.href = "/verify-otp";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 px-4">
      <div className="relative backdrop-blur-xl bg-gray-900/60 shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-blue-500/20 overflow-hidden">
        {/* Architectural grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px),
                             linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-white text-center tracking-wide">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                JOIN THE BLUEPRINT
              </span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full ml-4"></div>
          </div>

          <p className="text-gray-300 text-center mb-8 font-light">
            Create your professional account
          </p>

          <div className="space-y-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-3.5 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-3.5 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <input
                  name="first_name"
                  type="text"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <input
                name="phone"
                type="text"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-3.5 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className={`w-full py-3.5 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25"
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  BUILDING YOUR ACCOUNT...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  START BUILDING
                </span>
              )}
            </button>
          </div>

          {/* Divider with architectural line */}
          <div className="flex items-center my-8">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            <span className="mx-4 text-gray-400 text-sm font-medium tracking-wider">DRAFT WITH</span>
            <div className="flex-grow h-px bg-gradient-to-l from-transparent via-gray-600 to-transparent" />
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = "/oauth-login"}
              className="w-full group flex items-center justify-center py-3.5 gap-3 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300 text-gray-300 font-medium"
            >
              <div className="p-2 bg-white rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
              </div>
              <span className="group-hover:text-white transition-colors">Continue with Google</span>
            </button>

            <button
              onClick={() => window.location.href = "/oauth-login"}
              className="w-full group flex items-center justify-center py-3.5 gap-3 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300 text-gray-300 font-medium"
            >
              <div className="p-2 bg-blue-700 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <span className="group-hover:text-white transition-colors">Continue with LinkedIn</span>
            </button>
          </div>

          <p className="mt-8 text-center text-gray-400">
            Already have blueprints?{" "}
            <a href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors">
              Access Site
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}