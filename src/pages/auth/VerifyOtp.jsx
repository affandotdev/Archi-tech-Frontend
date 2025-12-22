import { useState, useEffect } from "react";
import { verifyOtp } from "../../services/auth";
import Card from "../../shared/components/Card";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [purpose, setPurpose] = useState("registration"); // Default to registration

  // Determine purpose based on URL or localStorage
  useEffect(() => {
    // Check if this is for password reset
    const resetEmail = localStorage.getItem("reset_email");
    const regEmail = localStorage.getItem("registration_email");

    if (resetEmail) {
      setEmail(resetEmail);
      setPurpose("password_reset");
    } else if (regEmail) {
      setEmail(regEmail);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await verifyOtp({ email, otp, purpose });
      if (purpose === "password_reset") {
        setMessage("OTP verified successfully! Redirecting to reset password...");
        setTimeout(() => {
          window.location.href = "/reset-password";
        }, 2000);
      } else {
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "OTP verification failed");
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
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            Verify Your Email
          </h2>
          <p className="text-slate-500 text-sm">
            Please enter the verification code sent to
          </p>
          <p className="text-indigo-600 font-medium mt-1">
            {email || "your email address"}
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-3 text-emerald-700 text-sm animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-700 text-sm animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div>
            <Input
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center tracking-[0.5em] text-lg font-mono placeholder:tracking-normal"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-base"
            isLoading={loading}
            variant="primary"
          >
            Verify Account
          </Button>
        </form>

        <div className="mt-8 text-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl border-t border-slate-100">
          <p className="text-slate-600 text-sm">
            Already verified?{" "}
            <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
