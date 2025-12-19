import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import Spinner from "../../shared/components/Spinner";

// Mock service call function for now, replace with actual service if separate
import { getProfile } from "../../services/ProfileService";

export default function ArchitectProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                // Assuming getProfile fetches based on authenticated user token
                const res = await getProfile();

                let data = res.data;
                if (data.data) data = data.data;
                if (data.profile) data = { ...data, ...data.profile };
                if (data.user) data = { ...data, ...data.user };

                setProfile(data);
            } catch (err) {
                console.error("Error fetching architect profile:", err);
                if (err.response?.status === 404) {
                    setError("Profile not found");
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
        try { return new Date(value).toLocaleDateString(); } catch { return value; }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Spinner size="lg" color="indigo" /></div>;
    }

    if (error === "Profile not found") {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar title="Architect Studio" user={authUser} />
                <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Architect Profile Setup</h1>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Establish your professional presence.
                        </p>
                        <Button onClick={() => navigate("/architect/edit-profile")} variant="primary" size="lg">
                            Create Profile
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) return null;
    const avatarUrl = buildImageUrl(profile.profile_image || profile.avatar_url);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="Architect Studio" user={authUser} />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-sky-500 tracking-wider mb-1 uppercase">
                            Architect Profile
                        </p>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Professional Overview
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate("/architect/dashboard")}>Dashboard</Button>
                        <Button variant="primary" onClick={() => navigate("/architect/edit-profile")}>Edit Profile</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="flex flex-col items-center p-8 border-sky-100">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-sky-400 to-indigo-500 shadow-xl">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-slate-300">
                                                {(profile.first_name?.[0] || "A").toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 text-center">
                                {profile.full_name || `${profile.first_name} ${profile.last_name}`}
                            </h2>
                            <p className="text-sky-600 text-sm mt-1 font-medium bg-sky-50 px-3 py-1 rounded-full">
                                {profile.studio || "Independent Architect"}
                            </p>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <Card title="Professional Summary" className="border-sky-100">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {profile.bio || "No summary provided."}
                            </p>
                        </Card>

                        <Card title="Details" className="border-sky-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Experience</p>
                                    <p className="text-base text-slate-700 font-medium">{profile.experience_years ? `${profile.experience_years} Years` : "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">License No.</p>
                                    <p className="text-base text-slate-700 font-medium">{profile.license_number || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Specialization</p>
                                    <p className="text-base text-slate-700 font-medium">{profile.specialization || "General"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Contact</p>
                                    <p className="text-base text-slate-700 font-medium">{profile.contact_email || profile.email || "—"}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
