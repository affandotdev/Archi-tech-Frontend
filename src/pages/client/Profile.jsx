import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/ProfileService";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import Spinner from "../../shared/components/Spinner";

export default function Profile() {
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
        const res = await getProfile();
        console.log("Client Profile Raw Response:", res);

        let data = res.data;
        if (data.data) {
          data = data.data;
        }

        if (data.profile) {
          data = { ...data, ...data.profile };
        }
        if (data.user) {
          data = { ...data, ...data.user };
        }

        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);

        if (err.response?.status === 404) {
          setError("Profile not found");
        } else if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" color="indigo" />
      </div>
    );
  }

  if (error === "Profile not found") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar title="Client Portal" user={authUser} />
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👋</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome!</h1>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              You haven&apos;t set up your profile yet. Create one now to let architects know who you are.
            </p>
            <Button onClick={() => navigate("/client/edit-profile")} variant="primary" size="lg">
              Create My Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full mx-4 bg-white border border-rose-200 rounded-xl shadow-lg p-6">
          <h1 className="text-xl font-semibold text-rose-600 mb-2">Something went wrong</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const avatarUrl = buildImageUrl(profile.profile_image || profile.avatar_url);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Client Portal" user={authUser} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-indigo-500 tracking-wider mb-1 uppercase">
              Client Account
            </p>
            <h1 className="text-3xl font-bold text-slate-800">
              My Profile
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/client/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/client/edit-profile")}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M4 20h4l9.268-9.268a1 1 0 000-1.414l-2.586-2.586a1 1 0 00-1.414 0L4 16v4z" />
              </svg>
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="flex flex-col items-center p-8 border-indigo-100">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span className="text-4xl font-bold text-slate-300 select-none">
                        {(profile.first_name?.[0] || profile.full_name?.[0] || "U").toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 text-center">
                {profile.full_name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Unnamed User"}
              </h2>
              <p className="text-indigo-500 text-sm mt-1 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                {profile.location || "Location not set"}
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mt-8 border-t border-slate-100 pt-6">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Connections</p>
                  <p className="text-xl text-indigo-600 mt-1 font-bold">
                    {profile.connection_count || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Joined</p>
                  <p className="text-sm text-slate-600 mt-1 font-mono">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
              </div>

              <div className="text-center mt-4 pt-4 border-t border-slate-100 w-full">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Updated</p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatDate(profile.updated_at)}
                </p>
              </div>
            </Card>
          </div>

          {/* Main Content / Right Column */}
          <div className="lg:col-span-8 space-y-6">
            <Card title="About Me" className="border-indigo-100">
              <div className="prose prose-slate max-w-none">
                {profile.bio ? (
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">
                    No bio provided yet. Click "Edit Profile" to add one.
                  </p>
                )}
              </div>
            </Card>

            <Card title="Personal Details" className="border-indigo-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1">First Name</p>
                  <p className="text-base text-slate-700 font-medium">{profile.first_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Last Name</p>
                  <p className="text-base text-slate-700 font-medium">{profile.last_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Display Name</p>
                  <p className="text-base text-slate-700 font-medium">{profile.full_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Location</p>
                  <p className="text-base text-slate-700 font-medium">{profile.location || "—"}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div >
    </div >
  );
}
