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
    return `http://localhost:8001${raw}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfile();
        const data = response.data?.data || response.data || {};
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          location: data.location || "",
        });
        setCurrentAvatar(buildImageUrl(data.profile_image || data.avatar_url));
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 404) {
          setError(
            "Profile not found. Fill in the form below to create your profile."
          );
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
      }, 1200);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to update profile. Please try again."
      );
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
      setCurrentAvatar(
        buildImageUrl(data.profile_image || data.avatar_url || currentAvatar)
      );
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900">
        <p className="text-lg text-gray-200">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-400 tracking-[0.25em] mb-2">
              EDIT PROFILE
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Personal Details
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl">
              Update the information architects use to understand who you are
              and where your projects are based.
            </p>
          </div>
          <button
            onClick={() => navigate("/client/profile")}
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl bg-gray-800 text-gray-200 text-sm font-semibold border border-gray-700 hover:bg-gray-700 transition-all duration-200"
          >
            Back to profile
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl">
            <p className="font-semibold mb-1">There was a problem</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl">
            <p className="font-semibold mb-1">Success</p>
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar / image upload */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 shadow-xl flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    {currentAvatar ? (
                      <img
                        src={currentAvatar}
                        alt="Current avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-3xl font-semibold text-white">
                        {profile.first_name
                          ? profile.first_name.charAt(0).toUpperCase()
                          : "C"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-base font-semibold text-white mb-2">
                Profile image
              </h2>
              <p className="text-xs text-gray-400 text-center mb-4">
                This helps your architects quickly recognize who they&apos;re
                collaborating with.
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
                className="mb-3 w-full text-xs text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              />

              <button
                onClick={handleUpload}
                disabled={saving || !imageFile}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200"
              >
                {saving ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300 tracking-[0.25em] mb-4">
                BASIC INFORMATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First name"
                    value={profile.first_name}
                    onChange={handleChange}
                    className="border border-gray-700 bg-gray-800/60 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last name"
                    value={profile.last_name}
                    onChange={handleChange}
                    className="border border-gray-700 bg-gray-800/60 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="block mb-1 text-xs font-medium text-gray-300">
                  Bio
                </label>
                <textarea
                  name="bio"
                  placeholder="Share a short summary about your background, interests, or the type of projects you take on."
                  value={profile.bio}
                  onChange={handleChange}
                  className="border border-gray-700 bg-gray-800/60 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 min-h-[96px] resize-vertical"
                  rows="4"
                />
              </div>

              <div className="mt-5">
                <label className="block mb-1 text-xs font-medium text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  value={profile.location}
                  onChange={handleChange}
                  className="border border-gray-700 bg-gray-800/60 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2"
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-gray-500 max-w-sm">
                  Your profile information is visible to professionals you work
                  with on projects.
                </p>
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-400 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
