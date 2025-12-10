import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUserStatus, updateUserRole, deleteUser } from '../../services/AdminService';

export default function AdminUserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadUser();
    }, [userId]);

    const loadUser = async () => {
        try {
            setLoading(true);
            const res = await getUserById(userId);
            setUser(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to load user", err);
            setError("User not found or failed to load.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async () => {
        if (!user) return;
        const currentIsActive = user.is_active;
        const newIsActive = !currentIsActive;

        try {
            setUpdating(true);
            // Optimistic update
            setUser(prev => ({ ...prev, is_active: newIsActive }));

            await updateUserStatus(user.id, newIsActive);
        } catch (err) {
            console.error("Failed to update status", err);
            // Revert
            setUser(prev => ({ ...prev, is_active: currentIsActive }));
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const handleRoleChange = async (newRole) => {
        if (!user || user.role === newRole) return;
        const oldRole = user.role;

        try {
            setUpdating(true);
            setUser(prev => ({ ...prev, role: newRole }));

            await updateUserRole(user.id, newRole);
        } catch (err) {
            console.error("Failed to update role", err);
            setUser(prev => ({ ...prev, role: oldRole }));
            alert("Failed to update role");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to PERMANENTLY delete this user? This cannot be undone.")) return;

        try {
            setUpdating(true);
            await deleteUser(user.id);
            navigate('/admin/users');
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Failed to delete user");
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white animate-pulse">Loading user details...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl text-red-400 font-bold mb-4">Error</h2>
                <p className="text-slate-300 mb-6">{error || "User not found"}</p>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Navigation */}
                <button
                    onClick={() => navigate('/admin/users')}
                    className="mb-8 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Directory
                </button>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Header Section */}
                    <div className="relative h-32 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
                        <div className="absolute -bottom-12 left-8 md:left-12">
                            <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.first_name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-slate-500">
                                        {(user.first_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 flex gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${user.is_active
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                {user.is_active ? 'Active' : 'Suspended'}
                            </span>
                        </div>
                    </div>

                    {/* Body Content */}
                    <div className="pt-16 pb-12 px-8 md:px-12">

                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {user.first_name} {user.last_name}
                                </h1>
                                <p className="text-slate-400">{user.email}</p>
                                <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                                    <span>ID: {user.id}</span>
                                    <span>•</span>
                                    <span>Joined {new Date(user.date_joined).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    disabled={updating}
                                    onClick={handleStatusToggle}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${user.is_active
                                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                                        }`}
                                >
                                    {user.is_active ? 'Suspend Account' : 'Activate Account'}
                                </button>

                                <button
                                    disabled={updating}
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 text-slate-300 hover:bg-red-600/20 hover:text-red-300 border border-slate-700 transition-all"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Role Management */}
                            <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50">
                                <h3 className="text-lg font-semibold text-white mb-4">Role & Permissions</h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-400">
                                        Current Role: <span className="text-indigo-400 font-medium capitalize">{user.role}</span>
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {['client', 'architect', 'engineer', 'admin'].map(role => (
                                            <button
                                                key={role}
                                                onClick={() => handleRoleChange(role)}
                                                disabled={user.role === role || updating}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${user.role === role
                                                    ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-500/30'
                                                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                                                    }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50">
                                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                                <dl className="space-y-4 text-sm">
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt className="text-slate-500">Phone</dt>
                                        <dd className="col-span-2 text-slate-300">{user.phone || "Not specified"}</dd>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt className="text-slate-500">Verified</dt>
                                        <dd className="col-span-2">
                                            {user.is_verified ? (
                                                <span className="text-emerald-400 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">Unverified</span>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt className="text-slate-500">MFA Enabled</dt>
                                        <dd className="col-span-2 text-slate-300">{user.has_mfa ? "Yes" : "No"}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
