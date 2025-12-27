import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import Spinner from "../../shared/components/Spinner";
import { getProfile } from "../../services/ProfileService";

export default function EngineerProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await getProfile();
                let data = res.data?.data || res.data || {};
                if (data.profile) data = { ...data, ...data.profile };
                if (data.user) data = { ...data, ...data.user };
                setProfile(data);
            } catch (err) {
                if (err.response?.status === 404) setError("Profile not found");
                else setError("Failed to load profile");
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Spinner size="lg" color="indigo" /></div>;

    if (error === "Profile not found") {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar title="Engineer Console" user={authUser} />
                <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Engineer Profile Setup</h1>
                        <Button onClick={() => navigate("/engineer/edit-profile")} variant="primary" size="lg" className="mt-4">
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
            <Navbar title="Engineer Console" user={authUser} />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-emerald-500 tracking-wider mb-1 uppercase">
                            Engineer Profile
                        </p>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Technical Profile
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate("/engineer/dashboard")}>Dashboard</Button>
                        <Button variant="primary" onClick={() => navigate("/engineer/edit-profile")}>Edit Profile</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="flex flex-col items-center p-8 border-emerald-100">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-slate-300">{(profile.first_name?.[0] || "E").toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 text-center">
                                {profile.full_name || `${profile.first_name} ${profile.last_name}`}
                            </h2>

                            <div className="flex w-full justify-around my-4 border-y border-emerald-50 py-3">
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Connections</p>
                                    <p className="text-lg text-emerald-600 mt-1 font-bold">{profile.connection_count || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Joined</p>
                                    <p className="text-xs text-slate-600 mt-1 font-mono">{formatDate(profile.created_at)}</p>
                                </div>
                            </div>

                            <p className="text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1 rounded-full">
                                {profile.discipline || "Structural Engineer"}
                            </p>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <Card title="Background" className="border-emerald-100">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {profile.bio || "No summary provided."}
                            </p>
                        </Card>

                        <Card title="Credentials" className="border-emerald-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Discipline</p>
                                    <p className="text-base text-slate-700 font-medium">{profile.discipline || "Civil"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">License No.</p>
                                    <p className="text-base text-slate-700 font-medium">{profile.license_number || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Experience</p>
                                    <p className="text-base text-slate-700 font-medium">{profile.experience_years ? `${profile.experience_years} Years` : "—"}</p>
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
