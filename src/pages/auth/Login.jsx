import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import loginBg from "../../assets/login-bg-new.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(data);
      console.log('Login response:', res.data);

      // Check if MFA is required
      if (res.data.mfa_required) {
        console.log('MFA is required, redirecting to MFA verification');
        // Store user ID and role for MFA verification
        localStorage.setItem("pending_user_id", res.data.user_id);
        if (res.data.role) {
          localStorage.setItem("pending_role", res.data.role);
        }
        // Redirect to MFA verification for login
        navigate("/mfa-login-verify");
      } else {
        // Login directly
        login(res.data);
        console.log('Login successful, redirecting based on role:', res.data.role);

        const role = (res.data.role || "").toLowerCase();

        if (role === 'architect') {
          navigate("/architect/dashboard");
        } else if (role === 'engineer') {
          navigate("/engineer/dashboard");
        } else if (role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/client/dashboard");
        }
      }
    } catch (err) {
      console.error('Login error details:', err.response?.data);
      const errorMessage = err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.response?.data?.non_field_errors ? err.response?.data?.non_field_errors[0] : null) ||
        "Invalid credentials. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex w-full lg:w-2/3 relative bg-slate-900 justify-center items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 transform hover:scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${loginBg})` }}
        ></div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="mb-8 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Build better,<br />together.</h1>
          <p className="text-xl text-indigo-100 font-light leading-relaxed">
            Join the platform where architects, engineers, and clients collaborate to create masterpiece structures.
          </p>
          <div className="mt-12 flex gap-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <span className="block text-2xl font-bold">10k+</span>
              <span className="text-xs text-indigo-200">Professionals</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <span className="block text-2xl font-bold">50k+</span>
              <span className="text-xs text-indigo-200">Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-1 text-sm">Sign in to access your workspace</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50/50 backdrop-blur-sm border border-rose-100 rounded-lg flex items-center gap-2 text-rose-700 text-xs animate-in fade-in slide-in-from-top-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              autoComplete="email"
              className="py-2.5 px-5 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
              containerClassName="text-sm"
            />

            <div>
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
                autoComplete="current-password"
                className="py-2.5 px-5 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
                containerClassName="text-sm"
              />
              <div className="flex justify-end mt-2 mr-2">
                <a href="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 text-sm rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:translate-y-[-1px] transition-all duration-300"
              isLoading={loading}
              variant="primary"
            >
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div>
            <Button
              variant="secondary"
              className="w-full justify-center py-2.5 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-sm"
              onClick={() => window.location.href = "/oauth-login"}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" /></svg>
              Google
            </Button>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}