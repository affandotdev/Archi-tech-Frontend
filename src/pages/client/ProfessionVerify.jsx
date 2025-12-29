import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfessionVerify() {
  const navigate = useNavigate();
  const [profession, setProfession] = useState("architect");
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!document) {
      setMessage("Please upload a document to verify your profession.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setStatus("");

    const formData = new FormData();
    formData.append("requested_role", profession);
    formData.append("document", document);

    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
      setMessage("You are not logged in. Please log in to continue.");
      setStatus("error");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/auth/profession-request/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      setMessage("Request submitted successfully! The admin will review your details shortly.");
      setStatus("success");

      // Optional: Redirect after delay?
      // setTimeout(() => navigate("/client/dashboard"), 3000);

    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);

      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to submit request. Please try again later.";
      setMessage(errorMessage);
      setStatus("error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/client/dashboard")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Profession Verification
            </h1>
          </div>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Status</h2>
            <p className="text-gray-400 text-sm">
              Upload your credentials to upgrade your account to a professional status.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profession Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Profession</label>
              <div className="relative">
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none transition-all"
                >
                  <option value="architect">Architect</option>
                  <option value="engineer">Engineer</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Document</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => setDocument(e.target.files[0])}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-3 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-orange-500/10 file:text-orange-400
                    hover:file:bg-orange-500/20
                    cursor-pointer bg-gray-800/50 border border-gray-700 rounded-xl"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25 flex items-center justify-center
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Verification Request"
              )}
            </button>

            {/* Status Messages */}
            {message && (
              <div
                className={`p-4 rounded-xl border ${status === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
                  } flex items-center`}
              >
                {status === "success" ? (
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
