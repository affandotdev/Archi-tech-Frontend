import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNotifications, markNotificationAsRead } from "../../features/chat/api/chat.api";

const Navbar = ({ title = "Dashboard", user }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    const fetchNotifications = async () => {
        const data = await getNotifications(user.id);
        setNotifications(data);
    };

    const handleMarkAsRead = async (notifId) => {
        await markNotificationAsRead(notifId);
        setNotifications(prev => prev.filter(n => n.id !== notifId));
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-40 bg-white/90 backdrop-blur-md">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {!user?.id ? (
                    /* Logged Out State - Separated Premium Buttons */
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-slate-600 font-bold text-sm tracking-wide hover:text-indigo-600 transition-colors relative group"
                        >
                            Log In
                            <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            Sign Up
                        </Link>
                    </div>
                ) : (
                    /* Logged In State */
                    <>
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                                className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
                            >
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            </button>

                            {showNotifDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10 cursor-default" onClick={() => setShowNotifDropdown(false)}></div>
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                                            <p className="text-sm font-semibold text-slate-800">Notifications</p>
                                            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div>
                                                                <p className="text-sm text-slate-800 font-medium">New Message</p>
                                                                <p className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">Check your messages</p>
                                                                <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.created_at).toLocaleTimeString()}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleMarkAsRead(notif.id)}
                                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                                            >
                                                                Mark Read
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-800 leading-none">
                                        {(user?.full_name || `${user?.first_name || ""} ${user?.last_name || ""}`).trim() || "User"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role || "Member"}</p>
                                </div>
                                <img
                                    src={user?.avatar_url || defaultAvatar}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <svg className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10 cursor-default"
                                        onClick={() => setShowDropdown(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
                                        </div>

                                        <Link
                                            to={user?.role === 'admin' ? '/client/profile' : `/${user?.role || 'client'}/profile`}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/admin/settings"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            Settings
                                        </Link>

                                        <div className="border-t border-slate-50 my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
