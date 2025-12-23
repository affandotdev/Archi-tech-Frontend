import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PortfolioService from "../api/portfolio.api";
import Navbar from "../../../widgets/Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";

export default function ProjectUpload() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
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
            if (!formData.title || !modelFile) {
                throw new Error("Title and 3D Model File are required.");
            }

            // Create FormData
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("project_type", formData.project_type);
            payload.append("location", formData.location);
            payload.append("year", formData.year);
            payload.append("description", formData.description);
            payload.append("visibility", formData.visibility);
            payload.append("model_file", modelFile);

            await PortfolioService.createProject(payload);

            const userStr = localStorage.getItem("user");
            const userId = userStr ? JSON.parse(userStr).id : null;

            if (userId) {
                navigate(`/portfolio/list/${userId}`);
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || err.message || "Failed to create project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="Upload Project" user={user} />

            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                New 3D Project
                            </h2>
                            <p className="text-slate-500 text-sm">Add a new model to your portfolio</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                const userStr = localStorage.getItem("user");
                                const uid = userStr ? JSON.parse(userStr).id : null;
                                if (uid) navigate(`/portfolio/list/${uid}`);
                            }}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            View All Projects
                        </button>
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
                                        placeholder="e.g. Modern Cliffside Villa"
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
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
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
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                        placeholder="e.g. New York, NY"
                                    />
                                </div>
                            </div>

                            {/* Model File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">3D Model File (.glb) <span className="text-rose-500">*</span></label>
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${modelFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'}`}>
                                    <input
                                        type="file"
                                        accept=".glb,.gltf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="model-upload"
                                        required
                                    />
                                    <label htmlFor="model-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                        {modelFile ? (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                                <span className="text-emerald-700 font-semibold">{modelFile.name}</span>
                                                <span className="text-xs text-emerald-600 mt-1">{(modelFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                </div>
                                                <span className="text-slate-600 font-medium">Click to upload .glb file</span>
                                                <span className="text-xs text-slate-400 mt-2">Maximum file size: 50MB</span>
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
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-32 resize-none placeholder:text-slate-400"
                                    placeholder="Describe architectural features, materials, and design concepts..."
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
                                    {loading ? "Uploading..." : "Publish Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
