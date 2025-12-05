import { useEffect, useState } from "react";
import http from "../../../services/http";
import { useNavigate } from "react-router-dom";

export default function MFASetup() {
  const [qrImage, setQrImage] = useState("");
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch QR Code & Secret
  useEffect(() => {
    const fetchMFASetup = async () => {
      try {
        const res = await http.get("/mfa/setup/");
        setQrImage(res.data.qr_code); // base64 image
        setSecret(res.data.secret);
        setLoading(false);
      } catch (err) {
        alert("Error loading MFA setup.");
      }
    };

    fetchMFASetup();
  }, []);

  // Verify OTP
  const handleVerify = async () => {
    try {
      const res = await http.post("/mfa/verify-setup/", {
        otp: otp,
      });

      alert("MFA Enabled Successfully!");
      navigate("/dashboard");

    } catch (err) {
      alert("Invalid OTP. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Enable Two-Factor Authentication</h1>

      <p className="text-gray-600 mb-6">
        Scan the QR code below with Google Authenticator
      </p>

      {/* QR CODE */}
      <img
        src={`data:image/png;base64,${qrImage}`}
        alt="QR Code"
        className="w-60 h-60 mb-5 border p-2 bg-white shadow"
      />

      {/* SECRET (Optional display) */}
      <p className="text-sm text-gray-500 mb-3">
        If scanning doesn't work, enter this code manually:
        <span className="font-bold ml-2">{secret}</span>
      </p>

      {/* OTP INPUT */}
      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit code"
        className="border p-3 rounded text-center text-lg w-64"
      />

      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white mt-5 px-6 py-3 rounded"
      >
        Verify & Enable MFA
      </button>
    </div>
  );
}
