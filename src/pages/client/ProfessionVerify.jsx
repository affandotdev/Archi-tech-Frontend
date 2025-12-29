import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfessionVerify() {
  const navigate = useNavigate();
  const [profession, setProfession] = useState("architect");
  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("File size exceeds 5MB limit. Please choose a smaller file.");
        setStatus("error");
        return;
      }
      
      // Check file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setMessage("Invalid file type. Please upload PDF, JPG, or PNG files only.");
        setStatus("error");
        return;
      }
      
      setDocument(file);
      setDocumentName(file.name);
      setMessage("");
      setStatus("");
    }
  };

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
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/auth/profession-request/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );

      setMessage("Request submitted successfully! The admin will review your details shortly.");
      setStatus("success");
      setDocument(null);
      setDocumentName("");

    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);

      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to submit request. Please try again later.";
      setMessage(errorMessage);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800">
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/client/dashboard")}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Profession Verification
                </h1>
                <p className="text-xs text-slate-500">Upgrade your account status</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/client/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Panel - Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Why Verify?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">Professional Access</h3>
                    <p className="text-sm text-slate-600">Gain access to professional tools and features</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">Credibility Boost</h3>
                    <p className="text-sm text-slate-600">Build trust with verified professional status</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">Enhanced Features</h3>
                    <p className="text-sm text-slate-600">Unlock advanced project management tools</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="font-medium text-slate-800 mb-3">Required Documents</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                    </svg>
                    Professional license/certificate
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                    </svg>
                    Government-issued ID
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                    </svg>
                    Proof of professional membership
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Professional Verification Request</h2>
                <p className="text-slate-600 text-sm mt-1">Complete the form below to request professional status</p>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Profession Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Select Your Profession
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setProfession("architect")}
                        className={`p-4 rounded-xl border-2 transition-all ${profession === "architect" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${profession === "architect" ? "bg-blue-100" : "bg-slate-100"}`}>
                            <svg className={`w-5 h-5 ${profession === "architect" ? "text-blue-600" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-slate-800">Architect</h3>
                            <p className="text-xs text-slate-500">Building design & planning</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProfession("engineer")}
                        className={`p-4 rounded-xl border-2 transition-all ${profession === "engineer" 
                          ? "border-indigo-500 bg-indigo-50" 
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${profession === "engineer" ? "bg-indigo-100" : "bg-slate-100"}`}>
                            <svg className={`w-5 h-5 ${profession === "engineer" ? "text-indigo-600" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-slate-800">Engineer</h3>
                            <p className="text-xs text-slate-500">Technical & construction</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Upload Verification Document
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="block cursor-pointer"
                        >
                          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50 group ${
                            document ? "border-blue-300 bg-blue-50" : "border-slate-300"
                          }`}>
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-slate-700 font-medium">
                                {documentName ? documentName : "Click to upload or drag and drop"}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                PDF, JPG, or PNG (Max 5MB)
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {documentName && (
                        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{documentName}</p>
                              <p className="text-sm text-slate-500">{(document.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setDocument(null);
                              setDocumentName("");
                            }}
                            className="text-slate-500 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Messages */}
                  {message && (
                    <div
                      className={`p-4 rounded-xl border ${
                        status === "success"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          status === "success" ? "bg-emerald-100" : "bg-red-100"
                        }`}>
                          {status === "success" ? (
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{message}</p>
                          {status === "success" && (
                            <p className="text-sm mt-1 text-emerald-600">
                              You will be notified once your request is reviewed.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !document}
                      className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3
                        ${loading 
                          ? "bg-blue-400 cursor-not-allowed" 
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                        } text-white`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Request...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Submit Verification Request
                        </>
                      )}
                    </button>
                    <p className="text-center text-sm text-slate-500 mt-3">
                      By submitting, you agree to our verification process terms
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-slate-800">What happens next?</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Your request will be reviewed by our admin team within 24-48 hours. 
                    You'll receive an email notification once your status is updated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}