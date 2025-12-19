import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "", password: "" });
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
        // Login directly (should not happen in MFA-only system)
        login(res.data);
        console.log('MFA is not required, redirecting to dashboard');
        // Navigate to dashboard based on role
        const role = res.data.role;
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
      }
    } catch (err) {
      console.log('Login error:', err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-indigo-500/20 backdrop-blur-sm bg-white/95">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-2">Sign in to access your workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-700 text-sm animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <Input
            label="Email Address"
            id="username"
            type="email"
            placeholder="you@example.com"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            required
            autoComplete="username"
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
            />
            <div className="flex justify-end mt-1">
              <a href="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-base"
            isLoading={loading}
            variant="primary"
          >
            Sign In
          </Button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div>
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => window.location.href = "/oauth-login"}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" /></svg>
            Google
          </Button>
        </div>

        <div className="mt-8 text-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl border-t border-slate-100">
          <p className="text-slate-600 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Create account
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}