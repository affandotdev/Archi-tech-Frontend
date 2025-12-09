
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getProfile,
    updateProfile,
    uploadProfileImage,
} from "../../services/ProfileService";

export default function EditEngineerProfile() {
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
        if (typeof raw === "string" && raw.startsWith("http")) return raw;
        const path = raw.startsWith("/") ? raw : `/${raw}`;
        return `http://localhost:8001${path}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await getProfile();
                let data = response.data;
                if (data.data) data = data.data;
                if (data.profile) data = { ...data, ...data.profile };
                if (data.user) data = { ...data, ...data.user };

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
                if (err.response?.status !== 404) {
                    setError("Failed to load existing profile.");
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
            await updateProfile(profile);
            setSuccess("Profile updated successfully!");
            setTimeout(() => navigate("/engineer/profile"), 1000);
        } catch (err) {
            setError("Failed to update profile.");
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
            const formData = new FormData();
            formData.append("profile_image", imageFile);
            const res = await uploadProfileImage(formData);
            setSuccess("Image uploaded successfully!");

            const data = res?.data?.data || res?.data || {};
            const newAvatarUrl = data.profile_image || data.avatar_url;
            if (newAvatarUrl) setCurrentAvatar(buildImageUrl(newAvatarUrl));
            setImageFile(null);
        } catch (err) {
            setError("Failed to upload image.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
                <p className="text-emerald-200 animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-emerald-400 tracking-[0.25em] mb-2 uppercase">
                            Settings
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Edit Engineer Profile
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate("/engineer/profile")}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:text-white transition"
                    >
                        Cancel
                    </button>
                </div>

                {error && <div className="mb-4 bg-red-500/20 text-red-200 p-4 rounded-xl">{error}</div>}
                {success && <div className="mb-4 bg-emerald-500/20 text-emerald-200 p-4 rounded-xl">{success}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-800 mb-4">
                                {currentAvatar ? (
                                    <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-4xl font-bold">
                                        {profile.first_name?.[0] || "E"}
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="text-xs text-slate-400 mb-4 w-full"
                            />
                            {imageFile && (
                                <button
                                    onClick={handleUpload}
                                    disabled={saving}
                                    className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 text-sm"
                                >
                                    {saving ? "Uploading..." : "Upload Photo"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase text-slate-400 mb-2 font-semibold">First Name</label>
                                    <input
                                        name="first_name"
                                        value={profile.first_name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-slate-400 mb-2 font-semibold">Last Name</label>
                                    <input
                                        name="last_name"
                                        value={profile.last_name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-slate-400 mb-2 font-semibold">Location</label>
                                <input
                                    name="location"
                                    value={profile.location}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-slate-400 mb-2 font-semibold">Bio</label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none min-h-[120px]"
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
