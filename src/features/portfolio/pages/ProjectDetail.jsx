import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PortfolioService from "../api/portfolio.api";
import ProjectScene from "../three/ProjectScene";
import ModelLoader from "../three/ModelLoader";
import { useAuth } from "../../../context/AuthContext";

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
            // Navigate back to portfolio list or dashboard
            if (user && project) {
                navigate(`/portfolio/list/${project.owner_id}`);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Failed to delete project", err);
            alert("Failed to delete project.");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Loading Project...</div>;
    if (error || !project) return <div className="h-screen flex items-center justify-center bg-gray-900 text-red-400">{error || "Project not found"}</div>;

    const isOwner = user && (String(user.id) === String(project.owner_id) || user.role === 'admin');

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* 3D Viewer Section (Top Half) */}
            <div className="h-[60vh] w-full bg-black relative shadow-2xl shadow-purple-900/20">
                <div className="absolute top-4 left-4 z-10">
                    <Link to={`/portfolio/list/${project.owner_id}`} className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all flex items-center gap-2">
                        ← Back to Portfolio
                    </Link>
                </div>

                {isOwner && (
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <Link
                            to={`/portfolio/edit/${project.id}`}
                            className="px-4 py-2 bg-indigo-600/80 backdrop-blur-md rounded-lg text-white hover:bg-indigo-500 transition-all flex items-center gap-2 font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-rose-600/80 backdrop-blur-md rounded-lg text-white hover:bg-rose-500 transition-all flex items-center gap-2 font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Delete
                        </button>
                    </div>
                )}

                {project.model_file ? (
                    <ProjectScene>
                        <ModelLoader url={project.model_file} />
                    </ProjectScene>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        No 3D Model Available
                    </div>
                )}

                <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur text-xs px-3 py-1 rounded text-gray-300">
                        Left Click to Rotate • Right Click to Pan • Scroll to Zoom
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="max-w-5xl mx-auto p-8 -mt-10 relative z-20">
                <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">📍 {project.location}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span>{project.project_type}</span>
                                {project.year && (
                                    <>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                        <span>{project.year}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
                                Contact Architect
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-white/5 pt-8">
                        <h2 className="text-xl font-semibold mb-4 text-blue-300">About this Project</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {project.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
