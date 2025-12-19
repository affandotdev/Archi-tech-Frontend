import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Assuming react-router
import { useAuth } from "../../context/AuthContext"; // Assuming AuthContext exists

const Sidebar = ({ role = "client", links = [] }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth(); // Assuming logout function
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`bg-slate-900 h-screen sticky top-0 flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-72"
                }`}
        >
            {/* Brand */}
            <div className="h-20 flex items-center justify-center border-b border-slate-800">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-xl tracking-wide text-white animate-in fade-in duration-300">
                            ArchiTech
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive(link.path)
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                    >
                        <div className={`shrink-0 transition-transform duration-200 ${isActive(link.path) ? "scale-110" : "group-hover:scale-110"}`}>
                            {link.icon}
                        </div>
                        {!collapsed && (
                            <span className="font-medium truncate animate-in fade-in slide-in-from-left-2 duration-300">
                                {link.label}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            {/* Footer / Toggle */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    {collapsed ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                    ) : (
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                            <span className="text-sm font-medium">Collapse Sidebar</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
