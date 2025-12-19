import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUserStatus, updateUserRole, deleteUser } from '../../services/AdminService';
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import Spinner from "../../shared/components/Spinner";
import Modal from "../../shared/components/Modal";

export default function AdminUserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadUser();
    }, [userId]);

    const loadUser = async () => {
        try {
            setLoading(true);
            const res = await getUserById(userId);
            const userData = res.data;
            if (!userData.id && userData._id) userData.id = userData._id;
            setUser(userData);
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
            setUser(prev => ({ ...prev, is_active: newIsActive }));
            await updateUserStatus(user.id, newIsActive);
        } catch (err) {
            console.error("Failed to update status", err);
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
        try {
            setIsDeleting(true);
            await deleteUser(user.id);
            navigate('/admin/users');
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Failed to delete user");
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Spinner size="lg" color="indigo" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl text-rose-600 font-bold mb-4">Error</h2>
                <p className="text-slate-500 mb-6">{error || "User not found"}</p>
                <Button onClick={() => navigate('/admin/users')} variant="outline">
                    Back to Users
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="Admin Console" user={authUser} />

            <div className="max-w-5xl mx-auto py-8 px-4">
                {/* Navigation */}
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate('/admin/users')} className="pl-0 hover:bg-transparent text-slate-500 hover:text-slate-800">
                        ← Back to Directory
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Identity & Status */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="flex flex-col items-center p-8 border-indigo-100 relative overflow-hidden">
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${user.is_active
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                    {user.is_active ? 'Active' : 'Suspended'}
                                </span>
                            </div>

                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl mb-6">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.first_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-slate-300">
                                            {(user.first_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-slate-800 text-center">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-slate-500 text-sm">{user.email}</p>
                            <div className="mt-2 text-xs text-slate-400 font-mono">ID: {user.id}</div>

                            <div className="mt-8 w-full space-y-3">
                                <Button
                                    variant={user.is_active ? "danger" : "secondary"}
                                    className="w-full justify-center"
                                    onClick={handleStatusToggle}
                                    isLoading={updating}
                                >
                                    {user.is_active ? 'Suspend Account' : 'Activate Account'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-center border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    disabled={updating}
                                >
                                    Delete User
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Details & Roles */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Role Management" className="border-indigo-100">
                            <div className="mb-4">
                                <p className="text-sm text-slate-500 mb-3">Current Role</p>
                                <div className="flex flex-wrap gap-2">
                                    {['client', 'architect', 'engineer', 'admin'].map(role => (
                                        <button
                                            key={role}
                                            onClick={() => handleRoleChange(role)}
                                            disabled={user.role === role || updating}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider border transition-all duration-200 ${user.role === role
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <Card title="Profile Information" className="border-indigo-100">
                            <dl className="space-y-4 text-sm">
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-4">
                                    <dt className="text-slate-500 font-medium">Phone</dt>
                                    <dd className="col-span-2 text-slate-800 font-semibold">{user.phone || "Not specified"}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-4">
                                    <dt className="text-slate-500 font-medium">Joined Date</dt>
                                    <dd className="col-span-2 text-slate-800 font-semibold">
                                        {new Date(user.date_joined).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-4">
                                    <dt className="text-slate-500 font-medium">Verified</dt>
                                    <dd className="col-span-2">
                                        {user.is_verified ? (
                                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                Verified Account
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 font-medium">Unverified</span>
                                        )}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-slate-500 font-medium">MFA Enabled</dt>
                                    <dd className="col-span-2 text-slate-800 font-semibold">{user.has_mfa ? "Yes" : "No"}</dd>
                                </div>
                            </dl>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete User"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-rose-50 text-rose-700 rounded-lg text-sm">
                        <strong>Warning:</strong> This action is permanent and cannot be undone. All data associated with this user will be removed.
                    </div>
                    <p className="text-slate-600">
                        Are you sure you want to delete
                        <span className="font-semibold text-slate-900"> {user.first_name} {user.last_name}</span>?
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
                            Yes, Delete User
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
