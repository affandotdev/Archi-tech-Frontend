import React, { useState } from "react";
import { registerUser } from "../../services/auth";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 px-4 py-12">
      <Card className="w-full max-w-lg shadow-2xl border-indigo-500/20 backdrop-blur-sm bg-white/95">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            Join ArchiTech
          </h2>
          <p className="text-slate-500 text-sm">
            Create your professional account to get started.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-700 text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              id="first_name"
              name="first_name"
              placeholder="Jane"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              id="last_name"
              name="last_name"
              placeholder="Doe"
              value={form.last_name}
              onChange={handleChange}
              required
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
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-3 text-base"
              isLoading={loading}
              variant="primary"
            >
              start building account
            </Button>
          </div>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => (window.location.href = "/oauth-login")}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" /></svg>
            Google
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => (window.location.href = "/oauth-login")}
          >
            <svg className="w-5 h-5 mr-2 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            LinkedIn
          </Button>
        </div>

        <div className="mt-8 text-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl border-t border-slate-100">
          <p className="text-slate-600 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}