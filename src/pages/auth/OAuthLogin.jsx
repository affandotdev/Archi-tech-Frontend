import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OAuthLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const GOOGLE_CLIENT_ID =
    "774234535784-dtugf57teeet9fblacdm2702b7rfrcqt.apps.googleusercontent.com";

  useEffect(() => {
    // Check if google is already loaded
    if (typeof window.google !== 'undefined') {
      initializeGoogleSignIn();
    } else {
      // Wait for the google script to load
      const interval = setInterval(() => {
        if (typeof window.google !== 'undefined') {
          clearInterval(interval);
          initializeGoogleSignIn();
        }
      }, 100);
      
      // Clear interval after 5 seconds to prevent infinite loop
      setTimeout(() => clearInterval(interval), 5000);
    }
  }, []);

  const initializeGoogleSignIn = () => {
    /* global google */
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      }
    );
  };

  // FIXED GOOGLE CALLBACK
  const handleCredentialResponse = async (response) => {
    try {
      const id_token = response.credential;

      const res = await fetch("http://localhost:8000/api/auth/oauth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: id_token }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Google OAuth failed");
        return;
      }

      // Check if MFA is required
      if (data.mfa_required) {
        // Save user data for MFA verification
        localStorage.setItem("pending_user_id", data.user_id);
        navigate("/mfa-login-verify");
      } else {
        // Save JWT
        login(data);
        navigate("/architect/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Google OAuth failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign in with Google
        </h2>

        <div id="googleSignInButton" className="flex justify-center"></div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthLogin;