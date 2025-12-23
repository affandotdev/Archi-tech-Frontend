import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PortfolioService from "../api/portfolio.api";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../widgets/Navbar/Navbar";

export default function PortfolioList() {
    const { userId } = useParams();
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Prioritize URL param, then logged-in user's ID
    const targetUserId = userId || user?.id || (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null);

    useEffect(() => {
        if (targetUserId) {
            loadProjects(targetUserId);
        } else {
            setLoading(false);
        }
    }, [targetUserId]);

    const loadProjects = async (id) => {
        try {
            const data = await PortfolioService.getUserProjects(id);
            setProjects(data);
        } catch (error) {
            console.error("Failed to load projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectId) => {
        try {
            await PortfolioService.deleteProject(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
        } catch (error) {
            console.error("Failed to delete project", error);
            alert("Failed to delete project. Please try again.");
        }
    };

    const dashboardLink = user?.role === "architect" ? "/architect/dashboard"
        : user?.role === "engineer" ? "/engineer/dashboard"
            : user?.role === "admin" ? "/admin/dashboard"
                : user?.role === "client" ? "/client/dashboard"
                    : "/dashboard";

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-slate-500 font-medium">Loading Portfolio...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="3D Portfolio" user={user} />

            {/* Header / Search Section */}
            <div className="bg-indigo-900 text-white py-12 px-4 shadow-lg mb-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 text-sm text-indigo-200 mb-2 justify-center md:justify-start">
                            <Link to={dashboardLink} className="hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <span>/</span>
                            <span className="font-medium text-white">Portfolio</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Project Gallery</h1>
                        <p className="text-indigo-200 max-w-2xl">
                            Immersive Experience in Every Dimension
                        </p>
                    </div>

                    {user && user.id == targetUserId && (
                        <Link
                            to="/portfolio/upload"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 hover:bg-indigo-50 rounded-full font-bold transition-all shadow-md transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Upload Project
                        </Link>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Removed inner header since it's now in banner */}

                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">No projects yet</h2>
                        <p className="text-slate-500 mt-2 max-w-md mx-auto">
                            Start building your portfolio by uploading your first 3D architectural model.
                        </p>
                        {user && user.id == targetUserId && (
                            <Link
                                to="/portfolio/upload"
                                className="mt-6 inline-block px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                Create your first project
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => {
                            const isOwner = user && (String(user.id) === String(project.owner_id) || user.role === 'admin');

                            return (
                                <div
                                    key={project.id}
                                    className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Thumbnail / Placeholder */}
                                    <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100 group-hover:bg-slate-50 transition-colors">
                                        <span className="text-5xl opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">🏢</span>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md mt-2 uppercase tracking-wide">
                                                    {project.project_type}
                                                </span>
                                            </div>
                                            {project.has_3d && (
                                                <div className="relative flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full" title="3D Model Available">
                                                    <div className="absolute w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                    <div className="absolute w-full h-full bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">
                                            {project.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                            <div className="flex items-center text-slate-400 text-xs">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {project.location}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isOwner && (
                                                    <div className="flex items-center gap-1 mr-2 border-r border-slate-100 pr-2">
                                                        <Link
                                                            to={`/portfolio/edit/${project.id}`}
                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                            title="Edit Project"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                        </Link>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (window.confirm("Are you sure you want to delete this project?")) {
                                                                    handleDelete(project.id);
                                                                }
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                                            title="Delete Project"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                )}

                                                <Link
                                                    to={`/portfolio/project/${project.id}`}
                                                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded hover:bg-indigo-600 transition-colors"
                                                >
                                                    View Model →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
