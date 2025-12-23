import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PortfolioService from "../api/portfolio.api";
import ProjectScene from "../three/ProjectScene";
import ModelLoader from "../three/ModelLoader";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../widgets/Navbar/Navbar";

export default function ProjectDetail() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const loadProject = async () => {
        try {
            const data = await PortfolioService.getProjectById(projectId);
            setProject(data);
        } catch (err) {
            setError("Failed to load project details.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }
        try {
            await PortfolioService.deleteProject(projectId);
            // Navigate back to portfolio list
            if (project) {
                navigate(`/portfolio/list/${project.owner_id}`);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Failed to delete project", err);
            alert("Failed to delete project.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-slate-500 font-medium">Loading Project...</div>
        </div>
    );

    if (error || !project) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-rose-500 font-medium">{error || "Project not found"}</div>
        </div>
    );

    const isOwner = user && (String(user.id) === String(project.owner_id) || user.role === 'admin');

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="Project Details" user={user} />

            {/* Hero / Header Section */}
            <div className="bg-indigo-900 text-white py-12 px-4 shadow-lg mb-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-indigo-200 mb-2">
                            <Link to={`/portfolio/list/${project.owner_id}`} className="hover:text-white transition-colors">
                                ← Back to Portfolio
                            </Link>
                            {/* <span>/</span>
                            <span className="font-medium text-white max-w-[200px] truncate">{project.title}</span> */}
                        </div>
                        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-indigo-200">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {project.location}
                            </span>
                            <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
                            <span className="uppercase tracking-wide font-semibold text-xs bg-indigo-800 px-2 py-0.5 rounded text-indigo-100">{project.project_type}</span>
                            {project.year && (
                                <>
                                    <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
                                    <span>{project.year}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {isOwner && (
                        <div className="flex gap-3">
                            <Link
                                to={`/portfolio/edit/${project.id}`}
                                className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all flex items-center gap-2 font-medium border border-white/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-rose-600/80 backdrop-blur-md rounded-lg text-white hover:bg-rose-500 transition-all flex items-center gap-2 font-medium shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: 3D Viewer (Takes 2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 3D Viewer Container */}
                        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative aspect-video border border-slate-800">
                            {project.model_file ? (
                                <ProjectScene>
                                    <ModelLoader url={project.model_file} />
                                </ProjectScene>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                    <span className="text-4xl mb-4">📦</span>
                                    <p>No 3D Model Available</p>
                                </div>
                            )}
                            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                                <div className="bg-black/60 backdrop-blur text-xs px-3 py-1.5 rounded-full text-gray-300 flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                                    Interactive 3D View
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery (Placeholder for now, could be added later) */}
                        {/* <div className="grid grid-cols-4 gap-4">
                             {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-slate-200 rounded-lg"></div>)}
                        </div> */}
                    </div>

                    {/* Right Column: Details (Takes 1/3 width) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                About this Project
                            </h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                                {project.description}
                            </p>
                        </div>

                        {/* Architect/Owner Card (Simplified) */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Project Architect</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                    A
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Architect</p>
                                    <Link to={`/portfolio/list/${project.owner_id}`} className="text-sm text-indigo-600 hover:underline">View Portfolio</Link>
                                </div>
                            </div>
                            <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200">
                                Contact for Inquiry
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
