import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BrowseArchitects() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data for architects
    const architects = [
        {
            id: 1,
            name: "John Doe",
            specialty: "Residential",
            experience: "10 years",
            rating: 4.8,
            location: "New York, NY",
            image: "",
        },
        {
            id: 2,
            name: "Jane Smith",
            specialty: "Commercial",
            experience: "8 years",
            rating: 4.9,
            location: "Los Angeles, CA",
            image: "",
        },
        {
            id: 3,
            name: "Robert Johnson",
            specialty: "Sustainable Design",
            experience: "15 years",
            rating: 4.7,
            location: "Chicago, IL",
            image: "",
        },
        {
            id: 4,
            name: "Emily Davis",
            specialty: "Interior Architecture",
            experience: "5 years",
            rating: 4.6,
            location: "Austin, TX",
            image: "",
        },
    ];

    const filteredArchitects = architects.filter((architect) =>
        architect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        architect.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
            {/* Navigation */}
            <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center cursor-pointer" onClick={() => navigate("/client/dashboard")}>
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">
                                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            ArchiTech
                                        </span>
                                        <span className="text-gray-300 ml-2">Browse Architects</span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate("/client/dashboard")}
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                {/* Search Header */}
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">Find Your Perfect Architect</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Connect with top-rated professionals for your next dream project.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search by name or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Architects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArchitects.map((architect) => (
                        <div key={architect.id} className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 group">
                            <div className="h-48 bg-gray-800 relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                {/* Placeholder for Architect Image - using initials if no image */}
                                <div className="absolute bottom-4 left-4 flex items-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold border-4 border-gray-900">
                                        {architect.name.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{architect.name}</h3>
                                        <p className="text-gray-400 text-sm">{architect.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs font-medium uppercase">{architect.specialty}</span>
                                    <div className="flex items-center text-yellow-400">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="ml-1 text-sm font-semibold">{architect.rating}</span>
                                    </div>
                                </div>

                                <p className="text-gray-300 text-sm mb-6">
                                    Experienced in {architect.specialty} with over {architect.experience} of handling complex projects.
                                </p>

                                <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-gray-700 transition-all font-medium">
                                    View Portfolio
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
