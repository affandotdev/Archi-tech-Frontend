import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/ProfileService";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProfile();
        console.log("Client Profile Raw Response:", res);

        let data = res.data;
        // Handle various response wrappers
        if (data.data) {
          data = data.data;
        }

        // Handle potential nested profile/user objects
        if (data.profile) {
          data = { ...data, ...data.profile };
        }
        if (data.user) {
          data = { ...data, ...data.user };
        }

        console.log("Parsed Client Profile Data:", data);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);

        if (err.response?.status === 404) {
          // This is a "normal" error for a new user who hasn't set up a profile yet
          setError("Profile not found");
        } else if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          // Optional: navigate("/login");
        } else {
          setError(
            err.response?.data?.error ||
            err.message ||
            "Failed to load profile."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const buildImageUrl = (raw) => {
    if (!raw) return null;
    if (typeof raw === "string" && raw.startsWith("http")) {
      return raw;
    }
    // Avoid double-slashes if raw starts with /
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return `http://localhost:8001${path}`;
  };

  const formatDate = (value) => {
    if (!value) return "Not set";
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900">
        <p className="text-lg text-gray-200 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  // If 404 or specific "not found" error, show the "Create Profile" UI
  if (error === "Profile not found" || (error && error.toLowerCase().includes("not found"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 px-4">
        <div className="max-w-md w-full bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl p-8 text-center backdrop-blur-sm">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">👋</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-gray-400 mb-8">
            You haven&apos;t set up your profile yet. Create one now to let architects know who you are.
          </p>
          <button
            onClick={() => navigate("/client/edit-profile")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/20"
          >
            Create My Profile
          </button>
        </div>
      </div>
    );
  }

  // Generic error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900">
        <div className="max-w-md w-full mx-4 bg-gray-900/80 border border-red-500/40 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
          <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null; // Should be covered by error states, but safe fallback

  const avatarUrl = buildImageUrl(profile.profile_image || profile.avatar_url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-400 tracking-[0.2em] mb-2 uppercase">
              Client Account
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              My Profile
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/client/dashboard")}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-semibold border border-transparent hover:bg-gray-700 hover:text-white transition-all duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/client/edit-profile")}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M4 20h4l9.268-9.268a1 1 0 000-1.414l-2.586-2.586a1 1 0 00-1.414 0L4 16v4z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8 flex flex-col items-center backdrop-blur-sm">
              <div className="relative mb-6 group">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-500 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-400 select-none">
                        {(profile.first_name?.[0] || profile.full_name?.[0] || "U").toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center">
                {profile.full_name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Unnamed User"}
              </h2>
              <p className="text-blue-400 text-sm mt-1 font-medium">
                {profile.location || "Location not set"}
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mt-8">
                <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-700/30">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Joined</p>
                  <p className="text-sm text-gray-200 mt-1 font-mono">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-700/30">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Updated</p>
                  <p className="text-sm text-gray-200 mt-1 font-mono">
                    {formatDate(profile.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content / Right Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                About Me
              </h3>

              <div className="prose prose-invert max-w-none">
                {profile.bio ? (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No bio provided yet. Click "Edit Profile" to add one.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs text-gray-500 mb-1">First Name</p>
                  <p className="text-base text-white font-medium">{profile.first_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Name</p>
                  <p className="text-base text-white font-medium">{profile.last_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Display Name</p>
                  <p className="text-base text-white font-medium">{profile.full_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-base text-white font-medium">{profile.location || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
