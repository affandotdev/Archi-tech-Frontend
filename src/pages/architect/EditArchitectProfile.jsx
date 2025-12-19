import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import Card from "../../shared/components/Card";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Spinner from "../../shared/components/Spinner";
import { getProfile, updateProfile } from "../../services/ProfileService"; // Reuse existing service

export default function EditArchitectProfile() {
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        bio: "",
        studio: "",
        experience_years: "",
        license_number: "",
        specialization: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

                setProfile({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    bio: data.bio || "",
                    studio: data.studio || "",
                    experience_years: data.experience_years || "",
                    license_number: data.license_number || "",
                    specialization: data.specialization || ""
                });
            } catch (err) {
                console.error("Error loading architect profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            setError(null);
            await updateProfile(profile);
            navigate("/architect/profile");
        } catch (err) {
            setError("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Spinner size="lg" color="indigo" /></div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="Architect Studio" user={authUser} />

            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-800">Edit Profile</h1>
                    <Button variant="outline" onClick={() => navigate("/architect/profile")}>Back</Button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-lg">{error}</div>
                )}

                <Card title="Professional Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input label="First Name" name="first_name" value={profile.first_name} onChange={handleChange} />
                        <Input label="Last Name" name="last_name" value={profile.last_name} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input label="Studio / Firm Name" name="studio" value={profile.studio} onChange={handleChange} placeholder="e.g. Skyline Architects" />
                        <Input label="Years of Experience" name="experience_years" type="number" value={profile.experience_years} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Input label="License Number" name="license_number" value={profile.license_number} onChange={handleChange} />
                        <Input label="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} placeholder="e.g. Residential, Commercial" />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-slate-700">Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[120px]"
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <Button variant="primary" onClick={handleUpdate} isLoading={saving}>Save Changes</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
