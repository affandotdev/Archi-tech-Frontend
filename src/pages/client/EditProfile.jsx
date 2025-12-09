import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/ProfileService";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
  });
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const buildImageUrl = (raw) => {
    if (!raw) return null;
    if (typeof raw === "string" && raw.startsWith("http")) {
      return raw;
    }
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return `http://localhost:8001${path}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfile();
        console.log("Edit Client Profile Raw Response:", response);

        let data = response.data;
        if (data.data) {
          data = data.data;
        }

        if (data.profile) {
          data = { ...data, ...data.profile };
        }
        if (data.user) {
          data = { ...data, ...data.user };
        }

        console.log("Parsed Edit Client Profile Data:", data);

        // Prevent controlled input nullification
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          location: data.location || "",
        });

        if (data.profile_image || data.avatar_url) {
          setCurrentAvatar(buildImageUrl(data.profile_image || data.avatar_url));
        }
      } catch (err) {
        console.warn("Error fetching profile (might be new user):", err);
        // If 404, we just let them stay on the form to create a new profile
        if (err.response?.status !== 404) {
          setError("Failed to load existing profile data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await updateProfile(profile);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate("/client/profile");
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      // Construct a better error message if available
      let errorMsg = "Failed to update profile.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        }
      }
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError("Please select an image file first.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const formData = new FormData();
      formData.append("profile_image", imageFile);

      const res = await uploadProfileImage(formData);
      setSuccess("Image uploaded successfully!");

      const data = res?.data?.data || res?.data || {};
      const newAvatarUrl = data.profile_image || data.avatar_url;

      if (newAvatarUrl) {
        setCurrentAvatar(buildImageUrl(newAvatarUrl));
      }
      // clear file input
      setImageFile(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please check file size and type.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900">
        <p className="text-lg text-gray-200 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-400 tracking-[0.25em] mb-2 uppercase">
              Profile Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Edit My Profile
            </h1>
          </div>
          <button
            onClick={() => navigate("/client/profile")}
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-semibold border border-transparent hover:bg-gray-700 hover:text-white transition-all duration-200"
          >
            Back to profile
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-6 py-4 rounded-xl flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar / image upload */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 shadow-xl flex flex-col items-center backdrop-blur-sm sticky top-6">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    {currentAvatar ? (
                      <img
                        src={currentAvatar}
                        alt="Current avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-semibold text-white">
                        {profile.first_name
                          ? profile.first_name.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-base font-bold text-white mb-2">
                Profile Photo
              </h2>

              <div className="w-full mt-4">
                <label className="block w-full cursor-pointer group">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImageFile(e.target.files[0]);
                        setError(null);
                      }
                    }}
                    className="block w-full text-xs text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-xs file:font-semibold
                          file:bg-blue-600 file:text-white
                          hover:file:bg-blue-500
                        "
                  />
                </label>

                {imageFile && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-gray-300 mb-2 truncate text-center">
                      Selected: {imageFile.name}
                    </p>
                    <button
                      onClick={handleUpload}
                      disabled={saving}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:bg-gray-700 text-sm font-medium transition-all"
                    >
                      {saving ? "Uploading..." : "Confirm Upload"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-xs font-semibold uppercase text-gray-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="e.g. John"
                    value={profile.first_name}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-4 py-3 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-semibold uppercase text-gray-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="e.g. Doe"
                    value={profile.last_name}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-4 py-3 transition-all"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block mb-2 text-xs font-semibold uppercase text-gray-400">
                  Current Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  value={profile.location}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-4 py-3 transition-all"
                />
              </div>

              <div className="mt-6">
                <label className="block mb-2 text-xs font-semibold uppercase text-gray-400">
                  Bio / Summary
                </label>
                <textarea
                  name="bio"
                  placeholder="Tell us a little about yourself..."
                  value={profile.bio}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-4 py-3 min-h-[120px] resize-y transition-all"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Short description for your public profile.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row sm:items-center justify-end gap-4">
                <button
                  onClick={() => navigate("/client/profile")}
                  className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {saving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
