
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/ProfileService";

export default function ArchitectProfile() {
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

                let data = res.data;
                if (data.data) data = data.data;
                if (data.profile) data = { ...data, ...data.profile };
                if (data.user) data = { ...data, ...data.user };

                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                if (err.response?.status === 404) {
                    setError("Profile not found");
                } else if (err.response?.status === 401) {
                    setError("Your session has expired. Please log in again.");
                } else {
                    setError("Failed to load profile.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const buildImageUrl = (raw) => {
        if (!raw) return null;
        if (typeof raw === "string" && raw.startsWith("http")) return raw;
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
                <p className="text-lg text-purple-200 animate-pulse">Loading architect profile...</p>
            </div>
        );
    }

    if (error === "Profile not found" || (error && error.toLowerCase().includes("not found"))) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 px-4">
                <div className="max-w-md w-full bg-slate-900/80 border border-purple-500/30 rounded-2xl shadow-2xl p-8 text-center backdrop-blur-sm">
                    <div className="w-20 h-20 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🏛️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome, Architect!</h1>
                    <p className="text-purple-200/70 mb-8">
                        Please set up your professional profile to showcase your portfolio.
                    </p>
                    <button
                        onClick={() => navigate("/architect/edit-profile")}
                        className="w-full bg-purple-600 text-white px-6 py-3.5 rounded-xl hover:bg-purple-500 transition-all font-semibold shadow-lg shadow-purple-500/20"
                    >
                        Create Profile
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
                <div className="text-red-400">{error}</div>
            </div>
        );
    }

    if (!profile) return null;

    const avatarUrl = buildImageUrl(profile.profile_image || profile.avatar_url);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-purple-400 tracking-[0.2em] mb-2 uppercase">
                            Architect Portal
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            My Profile
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/architect/dashboard")}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold border border-transparent hover:bg-slate-700 hover:text-white transition-all"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/architect/edit-profile")}
                            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 shadow-lg shadow-purple-500/20 transition-all"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-8 flex flex-col items-center backdrop-blur-sm">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-purple-500 to-indigo-500 shadow-xl">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-slate-500">
                                                {(profile.first_name?.[0] || "A").toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white text-center">
                                {profile.full_name || `${profile.first_name} ${profile.last_name}`.trim() || "Architect"}
                            </h2>
                            <p className="text-purple-400 text-sm mt-1 font-medium">
                                {profile.location || "Location not set"}
                            </p>

                            <div className="w-full mt-6 py-4 border-t border-purple-500/20 flex justify-center">
                                <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs uppercase tracking-wider font-semibold">
                                    Architect
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-purple-400 tracking-widest uppercase mb-6">
                                Professional Bio
                            </h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                {profile.bio || "No professional bio provided yet."}
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-purple-400 tracking-widest uppercase mb-6">
                                Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">First Name</p>
                                    <p className="text-white font-medium">{profile.first_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Last Name</p>
                                    <p className="text-white font-medium">{profile.last_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Email</p>
                                    <p className="text-white font-medium">{profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Joined</p>
                                    <p className="text-white font-medium">{formatDate(profile.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
