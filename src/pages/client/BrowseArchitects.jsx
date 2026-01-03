import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import FollowService from "../../features/follow/api/follow.api";
import Navbar from "../../widgets/Navbar/Navbar";

export default function BrowseArchitects() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("architects"); // architects | engineers
    const [architects, setArchitects] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        try {
            // Reusing the public landing endpoint for browsing
            const res = await axios.get("http://localhost:8001/api/landing/");
            setArchitects(res.data.architects);
            setEngineers(res.data.engineers);
        } catch (error) {
            console.error("Error fetching professionals", error);
        } finally {
            setLoading(false);
        }
    };

    const navToDashboard = () => {
        navigate("/client/dashboard");
    };

    const dataToDisplay = activeTab === "architects" ? architects : engineers;

    const filteredData = dataToDisplay.filter((person) => {
        const name = person.full_name || "";
        const location = person.location || "";
        const bio = person.bio || "";
        const term = searchTerm.toLowerCase();

        return (
            name.toLowerCase().includes(term) ||
            location.toLowerCase().includes(term) ||
            bio.toLowerCase().includes(term)
        );
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar user={user} title="One-Stop Marketplace" />

            {/* Header / Search Section */}
            <div className="bg-indigo-900 text-white py-12 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto text-center relative">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/client/dashboard")}
                        className="absolute left-0 top-1 text-indigo-300 hover:text-white flex items-center transition-colors mb-4 md:mb-0"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>

                    <h1 className="text-4xl font-bold mb-4">Find Your Expert</h1>
                    <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
                        Search for top-tier Architects and Engineers to collaborate on your vision.
                    </p>

                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search by name, location, or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-indigo-300 rounded-full py-4 px-6 pl-12 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all text-lg"
                        />
                        <svg className="w-6 h-6 text-indigo-300 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex justify-center mt-8 gap-4">
                        <button
                            onClick={() => setActiveTab("architects")}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === "architects"
                                ? "bg-white text-indigo-900 shadow-md"
                                : "bg-indigo-800/50 text-indigo-200 hover:bg-indigo-800"
                                }`}
                        >
                            Architects
                        </button>
                        <button
                            onClick={() => setActiveTab("engineers")}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === "engineers"
                                ? "bg-white text-indigo-900 shadow-md"
                                : "bg-indigo-800/50 text-indigo-200 hover:bg-indigo-800"
                                }`}
                        >
                            Engineers
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="text-center py-20 text-slate-500 text-xl font-medium">
                        Loading professionals...
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-400 text-lg">No professionals found matching your search.</p>
                        <button onClick={() => setSearchTerm("")} className="mt-4 text-indigo-600 hover:underline">
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredData.map((person) => (
                            <ProfessionalCard key={person.id} person={person} user={user} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProfessionalCard({ person, user }) {
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const navigate = useNavigate();
    const [requestStatus, setRequestStatus] = useState("connect"); // connect, pending, connected
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.role !== 'client') {
            alert("Only Clients can send connection requests.");
            return;
        }

        setLoading(true);
        try {
            const response = await FollowService.sendConnectionRequest(person.auth_user_id);
            if (response.status === 'pending' || response.status === 'approved') {
                setRequestStatus(response.status);
                // alert(`Request ${response.status === 'pending' ? 'sent' : 'approved'}!`);
            } else if (response.detail === 'request already exists') {
                setRequestStatus(response.status || 'pending');
                // alert(`Request is already ${response.status || 'pending'}.`);
            }
        } catch (error) {
            console.error("Connection failed", error);
            if (error.response?.data?.detail) {
                alert(error.response.data.detail);
            } else {
                alert("Failed to send request.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            <div className="relative mb-4 flex-shrink-0 mx-auto">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-slate-200 to-slate-300 group-hover:from-indigo-400 group-hover:to-purple-500 transition-colors duration-300">
                    <img
                        src={person.avatar_url || defaultAvatar}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover border-4 border-white bg-white"
                    />
                </div>
            </div>

            <h3 className="text-xl font-bold text-center text-slate-800 group-hover:text-indigo-700 transition-colors mb-1">
                {person.full_name || "Unnamed User"}
            </h3>

            <p className="text-xs text-center text-slate-500 uppercase tracking-wide font-semibold mb-3">
                {person.role || "Professional"}
            </p>

            <p className="text-slate-500 text-center text-sm mb-4 flex items-center justify-center gap-1">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {person.location || "Location N/A"}
            </p>

            <div className="bg-slate-50 rounded-lg p-3 mb-6 flex-grow ">
                <p className="text-slate-600 text-center text-xs leading-relaxed line-clamp-3 italic">
                    "{person.bio || "No bio available."}"
                </p>
            </div>

            <div className="space-y-3 mt-auto">
                <button
                    className={`w-full py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 ${requestStatus === 'pending' ? 'bg-amber-100 text-amber-700 cursor-allowed opacity-90' :
                        requestStatus === 'approved' ? 'bg-emerald-100 text-emerald-700 cursor-default' :
                            'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    onClick={handleConnect}
                    disabled={loading || (requestStatus !== 'connect' && requestStatus !== 'pending')}
                >
                    {loading ? 'Sending...' :
                        requestStatus === 'pending' ? 'Request Pending' :
                            requestStatus === 'approved' ? 'Connected' :
                                'Connect Now'}
                </button>

                <Link
                    to={`/portfolio/list/${person.auth_user_id}`}
                    className="block w-full py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-center"
                >
                    View Portfolio
                </Link>
            </div>
        </div>
    );
}
