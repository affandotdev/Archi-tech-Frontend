import React, { useState, useEffect } from "react";
import { setupMFA } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function MFASetup() {
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadQRCode();
  }, []);

  const loadQRCode = async () => {
    try {
      const res = await setupMFA();
      setQr(res.data.qr_code);
      setSecret(res.data.secret);
    } catch (err) {
      setError("Failed to load QR. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Setup Two-Factor Authentication
        </h2>

        <p className="text-gray-600 mb-4">
          Scan the QR code using <strong>Google Authenticator</strong> or any TOTP app.
        </p>

        {qr ? (
          <img
            src={`data:image/png;base64,${qr}`}
            alt="MFA QR"
            className="mx-auto mb-4 w-56 h-56 border p-2 rounded-lg shadow"
          />
        ) : (
          <p className="text-gray-500 mb-4">Loading QR…</p>
        )}

        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-700">
            <strong>Secret Key:</strong> {secret}
          </p>
        </div>

        <button
          onClick={() => navigate("/mfa-login-verify")}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue to Verify Code
        </button>

        {error && (
          <p className="mt-4 text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
