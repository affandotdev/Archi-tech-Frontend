import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PortfolioService from "../api/portfolio.api";
import Navbar from "../../../widgets/Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";

export default function ProjectEdit() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [modelFile, setModelFile] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        project_type: "residential",
        location: "",
        year: new Date().getFullYear(),
        description: "",
        visibility: "public"
    });

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const loadProject = async () => {
        try {
            const data = await PortfolioService.getProjectById(projectId);
            setFormData({
                title: data.title,
                project_type: data.project_type,
                location: data.location || "",
                year: data.year || new Date().getFullYear(),
                description: data.description || "",
                visibility: data.visibility
            });
            // Ensure only owner or admin can edit
            const isOwner = user && String(user.id) === String(data.owner_id);
            const isAdmin = user && user.role === 'admin';

            if (!isOwner && !isAdmin) {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Failed to load project", err);
            setError("Failed to load project details.");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setModelFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!formData.title) {
                throw new Error("Title is required.");
            }

            // Create FormData
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("project_type", formData.project_type);
            payload.append("location", formData.location);
            payload.append("year", formData.year);
            payload.append("description", formData.description);
            payload.append("visibility", formData.visibility);

            // Only append model file if a new one is selected
            if (modelFile) {
                payload.append("model_file", modelFile);
            }

            await PortfolioService.updateProject(projectId, payload);

            // Navigate back to project list or detail
            const userStr = localStorage.getItem("user");
            const userId = userStr ? JSON.parse(userStr).id : null;
            if (userId) {
                navigate(`/portfolio/list/${userId}`);
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || err.message || "Failed to update project.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-slate-500">Loading project details...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="Edit Project" user={user} />

            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Edit Project
                            </h2>
                            <p className="text-slate-500 text-sm">Update your project details</p>
                        </div>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg mb-6 flex items-center text-sm">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Title <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                        required
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Type</label>
                                    <div className="relative">
                                        <select
                                            name="project_type"
                                            value={formData.project_type}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="residential">Residential</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="interior">Interior Design</option>
                                            <option value="landscape">Landscape</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                                    <input
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Location */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Model File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Replace 3D Model (Optional)</label>
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${modelFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'}`}>
                                    <input
                                        type="file"
                                        accept=".glb,.gltf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="model-upload"
                                    />
                                    <label htmlFor="model-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                        {modelFile ? (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                                <span className="text-emerald-700 font-semibold">{modelFile.name}</span>
                                                <span className="text-xs text-emerald-600 mt-1">New file selected</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                </div>
                                                <span className="text-slate-600 font-medium">Keep existing model</span>
                                                <span className="text-xs text-slate-400 mt-2">Click to replace .glb file</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-32 resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
