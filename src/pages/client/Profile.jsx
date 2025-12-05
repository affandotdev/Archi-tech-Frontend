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
        const profileData = res.data?.data || res.data;
        console.log("Profile:", profileData);
        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);

        if (err.response?.status === 404) {
          setError("Profile not found. You can create one now.");
        } else if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          navigate("/login");
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
    // If backend already sent a full URL, use it as-is
    if (typeof raw === "string" && raw.startsWith("http")) {
      return raw;
    }
    // Fallback: assume user-service is on localhost:8001 and `raw` is a path
    return `http://localhost:8001${raw}`;
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
        <p className="text-lg text-gray-200">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900">
        <div className="max-w-md w-full mx-4 bg-gray-900/80 border border-red-500/40 rounded-2xl shadow-2xl p-6">
          <h1 className="text-xl font-semibold text-white mb-2">Profile</h1>
          <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-4">
            <p className="font-semibold mb-1">We couldn&apos;t load your profile</p>
            <p className="text-sm">{error}</p>
          </div>
          {error.toLowerCase().includes("not found") && (
            <button
              onClick={() => navigate("/client/edit-profile")}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 font-medium"
            >
              Create Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900">
        <div className="max-w-md w-full mx-4 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-300 mb-4">
            No profile data available yet. Let&apos;s create your profile.
          </p>
          <button
            onClick={() => navigate("/client/edit-profile")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 font-medium"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = buildImageUrl(profile.profile_image || profile.avatar_url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-400 tracking-[0.25em] mb-2">
              CLIENT PROFILE
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Account Overview
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl">
              Manage the details architects see when collaborating with you on projects.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/client/dashboard")}
              className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl bg-gray-800 text-gray-200 text-sm font-semibold border border-gray-700 hover:bg-gray-700 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to dashboard
            </button>
            <button
              onClick={() => navigate("/client/edit-profile")}
              className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536M4 20h4l9.268-9.268a1 1 0 000-1.414l-2.586-2.586a1 1 0 00-1.414 0L4 16v4z"
                />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: avatar + basic info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 shadow-xl flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-3xl font-semibold text-white">
                        {profile.full_name
                          ? profile.full_name.charAt(0).toUpperCase()
                          : "C"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white">
                {profile.full_name || "Your Name"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {profile.location || "Location not set"}
              </p>

              <div className="mt-4 w-full grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/60">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    Member Since
                  </p>
                  <p className="text-sm font-semibold text-white mt-1">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/60">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-white mt-1">
                    {formatDate(profile.updated_at)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/client/edit-profile")}
                className="mt-5 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-gray-800 text-blue-300 hover:text-white hover:bg-blue-600/80 border border-blue-500/40 transition-all duration-200 text-sm font-medium"
              >
                Edit profile details
              </button>
            </div>
          </div>

          {/* Right: detailed info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300 tracking-[0.25em] mb-4">
                PERSONAL DETAILS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1">First Name</p>
                  <p className="text-sm font-medium text-white border border-gray-800 rounded-lg px-3 py-2 bg-gray-800/40">
                    {profile.first_name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Name</p>
                  <p className="text-sm font-medium text-white border border-gray-800 rounded-lg px-3 py-2 bg-gray-800/40">
                    {profile.last_name || "Not set"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Display Name</p>
                  <p className="text-sm font-medium text-white border border-gray-800 rounded-lg px-3 py-2 bg-gray-800/40">
                    {profile.full_name || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300 tracking-[0.25em] mb-4">
                ABOUT YOU
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Bio</p>
                  <p className="text-sm text-gray-200 border border-gray-800 rounded-lg px-3 py-3 bg-gray-800/40 min-h-[64px] whitespace-pre-line">
                    {profile.bio || "Tell architects a little bit about yourself and your projects."}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Location</p>
                  <p className="text-sm text-gray-200 border border-gray-800 rounded-lg px-3 py-2 bg-gray-800/40">
                    {profile.location || "Not set"}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  These details help professionals understand your context before starting a project.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
