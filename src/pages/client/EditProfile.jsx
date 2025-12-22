import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/ProfileService";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import Card from "../../shared/components/Card";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Spinner from "../../shared/components/Spinner";

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
  const { user: authUser, updateUser } = useAuth();
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
      updateUser(profile); // Sync Navbar
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate("/client/profile");
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
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
        let absUrl = buildImageUrl(newAvatarUrl);
        setCurrentAvatar(absUrl);
        updateUser({ avatar_url: absUrl, profile_image: absUrl }); // Sync Navbar
      }
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" color="indigo" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Client Portal" user={authUser} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-indigo-500 tracking-wider mb-1 uppercase">
              Profile Settings
            </p>
            <h1 className="text-3xl font-bold text-slate-800">
              Edit My Profile
            </h1>
          </div>
          <Button
            variant="outline"
            className="hidden sm:inline-flex"
            onClick={() => navigate("/client/profile")}
          >
            Back to profile
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-700">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-3 text-emerald-700">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Area */}
          <div className="lg:col-span-1">
            <Card className="flex flex-col items-center p-6 border-indigo-100 sticky top-6">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {currentAvatar ? (
                      <img
                        src={currentAvatar}
                        alt="Current avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-semibold text-slate-300">
                        {profile.first_name ? profile.first_name.charAt(0).toUpperCase() : "U"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-800 mb-4">
                Profile Photo
              </h2>

              <div className="w-full">
                <label className="block w-full cursor-pointer group mb-4">
                  <div className="relative w-full h-10 flex items-center justify-center border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <span className="text-xs font-medium text-slate-600">Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setImageFile(e.target.files[0]);
                          setError(null);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </label>

                {imageFile && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-slate-500 mb-2 truncate text-center">
                      Selected: {imageFile.name}
                    </p>
                    <Button
                      onClick={handleUpload}
                      disabled={saving}
                      className="w-full text-xs"
                      size="sm"
                      isLoading={saving}
                    >
                      Confirm Upload
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2">
            <Card title="Basic Information" className="border-indigo-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Input
                  label="First Name"
                  name="first_name"
                  placeholder="e.g. John"
                  value={profile.first_name}
                  onChange={handleChange}
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  placeholder="e.g. Doe"
                  value={profile.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <Input
                  label="Current Location"
                  name="location"
                  placeholder="City, Country"
                  value={profile.location}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Bio / Summary
                </label>
                <textarea
                  name="bio"
                  placeholder="Tell us a little about yourself..."
                  value={profile.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[120px] resize-y text-sm text-slate-700 bg-white"
                />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/client/profile")}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdate}
                  isLoading={saving}
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
