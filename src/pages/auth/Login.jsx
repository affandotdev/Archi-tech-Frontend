import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <input 
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Email"
              type="email"
              required
              onChange={(e) => setData({ ...data, username: e.target.value })} 
            />
          </div>

          <div>
            <input 
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              type="password" 
              placeholder="Password"
              required
              onChange={(e) => setData({ ...data, password: e.target.value })} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold text-white rounded-lg transition ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <div>
              <button
                onClick={() => window.location.href = "/oauth-login"}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              Register
            </a>
          </p>
          <p className="text-center text-gray-600">
            <a href="/forgot-password" className="text-blue-600 font-medium hover:underline">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}