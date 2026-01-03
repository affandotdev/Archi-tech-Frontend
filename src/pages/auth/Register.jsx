import React, { useState } from "react";
import { registerUser } from "../../services/auth";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import registerBg from "../../assets/register-bg-new.png";

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
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // Clear error on input change
  };

  const submit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null);

    try {
      await registerUser(form);
      localStorage.setItem("registration_email", form.email);
      alert("Registered successfully! Check your email for OTP.");
      window.location.href = "/verify-otp";
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      const errorMessage = err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.response?.data?.email ? `Email: ${err.response.data.email[0]}` : null) ||
        "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex w-full lg:w-2/3 relative bg-indigo-900 justify-center items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 transform hover:scale-110 transition-transform duration-[2s]"
          style={{ backgroundImage: `url(${registerBg})` }}
        ></div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="mb-8 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">Start your<br />journey.</h1>
          <p className="text-xl text-indigo-100 font-light leading-relaxed drop-shadow-md">
            Unlock potential, showcase your portfolio, and connect with the best in the industry.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4 text-indigo-200">
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span>Global Network Access</span>
            </div>
            <div className="flex items-center gap-4 text-indigo-200">
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span>Portfolio Management Tools</span>
            </div>
            <div className="flex items-center gap-4 text-indigo-200">
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span>Secure Collaboration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-sm space-y-5">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Join ArchiTech</h2>
            <p className="text-slate-500 text-xs mt-1">Create your professional account to get started.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50/50 backdrop-blur-sm border border-rose-100 rounded-lg flex items-center gap-2 text-rose-700 text-xs text-left">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                id="first_name"
                name="first_name"
                placeholder="Jane"
                value={form.first_name}
                onChange={handleChange}
                required
                className="py-2.5 px-4 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
                containerClassName="text-sm"
              />
              <Input
                label="Last Name"
                id="last_name"
                name="last_name"
                placeholder="Doe"
                value={form.last_name}
                onChange={handleChange}
                required
                className="py-2.5 px-4 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
                containerClassName="text-sm"
              />
            </div>

            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="py-2.5 px-5 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
              containerClassName="text-sm"
            />

            <Input
              label="Phone Number"
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={handleChange}
              required
              className="py-2.5 px-5 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
              containerClassName="text-sm"
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="py-2.5 px-5 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
              containerClassName="text-sm"
            />

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full py-2.5 text-sm rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:translate-y-[-1px] transition-all duration-300"
                isLoading={loading}
                variant="primary"
              >
                Start Building Account
              </Button>
            </div>
          </form>

          <div className="my-5 flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="w-full justify-center py-2.5 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-sm"
              onClick={() => (window.location.href = "/oauth-login")}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" /></svg>
              Google
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-center py-2.5 text-sm rounded-full bg-white/60 backdrop-blur-md border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-sm"
              onClick={() => (window.location.href = "/oauth-login")}
            >
              <svg className="w-4 h-4 mr-2 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              LinkedIn
            </Button>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}