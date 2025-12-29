import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../widgets/Navbar/Navbar';
import { explainRequest, generatePlan } from '../api/ai.api';

// Utility to clean markdown artifacts from AI responses
const cleanMarkdown = (text) => {
    if (!text) return '';
    return text
        .replace(/\*\*/g, '')  // Remove bold markers
        .replace(/\*/g, '')    // Remove italic markers
        .replace(/#{1,6}\s/g, '') // Remove heading markers
        .replace(/\\/g, '')    // Remove escape characters
        .trim();
};

// Utility to format currency in Lakhs or Crores
const formatCurrency = (lakhs) => {
    if (!lakhs) return '0 Lakhs';
    const value = parseFloat(lakhs);

    if (value >= 100) {
        const crores = (value / 100).toFixed(2);
        return `₹ ${crores} Crores`;
    }
    return `₹ ${value.toFixed(2)} Lakhs`;
};

const AiAssistantPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const chatEndRef = useRef(null);

    const [activeTab, setActiveTab] = useState('chat');

    // Chat state
    const [query, setQuery] = useState('');
    const [conversation, setConversation] = useState([
        {
            role: 'ai',
            text: `Hello ${user?.first_name || 'Client'}! 👋\n\nI'm your AI Architectural Assistant. I can help you with:\n\n• Design ideas and recommendations\n• Construction cost estimates\n• Building regulations and codes\n• Material suggestions\n\nFeel free to ask me anything, or switch to "Project Planner" for detailed cost analysis.`
        }
    ]);
    const [chatLoading, setChatLoading] = useState(false);

    // Planner state
    const [planLoading, setPlanLoading] = useState(false);
    const [planResult, setPlanResult] = useState(null);
    const [formData, setFormData] = useState({
        plot_length_ft: '',
        plot_width_ft: '',
        floors: 1,
        location: 'city',
        building_type: 'house',
        quality: 'standard',
        budget_lakhs: '',
        budgetUnit: 'lakhs' // 'lakhs' or 'crores'
    });

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    // Chat Handlers
    const handleChatSend = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMessage = { role: 'user', text: query };
        setConversation(prev => [...prev, userMessage]);
        setQuery('');
        setChatLoading(true);

        try {
            const result = await explainRequest(query);
            const rawText = typeof result === 'string' ? result : (result.message || JSON.stringify(result));
            const cleanedText = cleanMarkdown(rawText);
            setConversation(prev => [...prev, { role: 'ai', text: cleanedText }]);
        } catch (error) {
            setConversation(prev => [...prev, {
                role: 'ai',
                text: "I apologize, but I'm having trouble connecting to my services right now. Please try again in a moment."
            }]);
        } finally {
            setChatLoading(false);
        }
    };

    // Planner Handlers
    const handlePlanSubmit = async (e) => {
        e.preventDefault();
        setPlanLoading(true);
        setPlanResult(null);

        // Convert budget to lakhs based on selected unit
        const budgetInLakhs = formData.budgetUnit === 'crores'
            ? parseFloat(formData.budget_lakhs) * 100
            : parseFloat(formData.budget_lakhs);

        const payload = {
            plot_length_ft: parseFloat(formData.plot_length_ft),
            plot_width_ft: parseFloat(formData.plot_width_ft),
            floors: parseInt(formData.floors),
            location: formData.location,
            building_type: formData.building_type,
            quality: formData.quality,
            budget_lakhs: budgetInLakhs
        };

        try {
            const data = await generatePlan(payload);
            // Clean the explanation text
            if (data.explanation) {
                data.explanation = cleanMarkdown(data.explanation);
            }
            setPlanResult(data);
        } catch (error) {
            alert("Failed to generate plan. Please check your inputs and try again.");
        } finally {
            setPlanLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex flex-col">
            <div className="shrink-0 z-10">
                <Navbar title="AI Assistant" user={user} />
            </div>

            <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-80px)]">

                {/* Header & Tabs */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            AI Architect Assistant
                        </h1>
                        <p className="text-slate-600 text-sm mt-1">Powered by advanced AI technology</p>
                    </div>

                    <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-1">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === 'chat'
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('planner')}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === 'planner'
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Planner
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">

                    {/* CHAT TAB */}
                    {activeTab === 'chat' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                                {conversation.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                        <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-md ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-sm'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                                            }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-6 py-4 flex items-center gap-2 shadow-md">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            </div>
                                            <span className="text-sm text-slate-600 ml-2">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 border-t border-slate-200 bg-slate-50">
                                <form onSubmit={handleChatSend} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Ask me anything about architecture..."
                                        className="flex-1 border-2 border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-slate-800 placeholder-slate-400"
                                        disabled={chatLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={chatLoading || !query.trim()}
                                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-400 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 disabled:shadow-none flex items-center gap-2"
                                    >
                                        <span>Send</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {/* PLANNER TAB */}
                    {activeTab === 'planner' && (
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-b from-slate-50/50 to-white">
                            <div className="max-w-4xl mx-auto">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        Project Details
                                    </h2>
                                    <p className="text-slate-600 text-sm ml-14">Fill in your project specifications for AI-powered cost estimation</p>
                                </div>

                                <form onSubmit={handlePlanSubmit} className="space-y-8">
                                    {/* Plot Dimensions */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                            Plot Dimensions
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Length (feet)</label>
                                                <input
                                                    required
                                                    type="number"
                                                    name="plot_length_ft"
                                                    value={formData.plot_length_ft}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    placeholder="e.g. 40"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Width (feet)</label>
                                                <input
                                                    required
                                                    type="number"
                                                    name="plot_width_ft"
                                                    value={formData.plot_width_ft}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    placeholder="e.g. 30"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Building Specifications */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                            Building Specifications
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Number of Floors</label>
                                                <input
                                                    required
                                                    type="number"
                                                    name="floors"
                                                    min="1"
                                                    max="10"
                                                    value={formData.floors}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Budget</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        required
                                                        type="number"
                                                        name="budget_lakhs"
                                                        value={formData.budget_lakhs}
                                                        onChange={handleInputChange}
                                                        className="flex-1 border-2 border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="e.g. 50"
                                                    />
                                                    <select
                                                        name="budgetUnit"
                                                        value={formData.budgetUnit}
                                                        onChange={handleInputChange}
                                                        className="border-2 border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                                                    >
                                                        <option value="lakhs">Lakhs</option>
                                                        <option value="crores">Crores</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Location Type</label>
                                                <select
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                >
                                                    <option value="city">City</option>
                                                    <option value="town">Town</option>
                                                    <option value="village">Village</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Building Type</label>
                                                <select
                                                    name="building_type"
                                                    value={formData.building_type}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                >
                                                    <option value="house">Independent House</option>
                                                    <option value="apartment">Apartment Complex</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Construction Quality */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                            Construction Quality
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['basic', 'standard', 'premium'].map(q => (
                                                <button
                                                    key={q}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, quality: q }))}
                                                    className={`py-4 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${formData.quality === q
                                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                                                        : 'border-slate-200 hover:border-indigo-300 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={planLoading}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-3 text-lg"
                                    >
                                        {planLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Generating Analysis...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Generate AI Plan & Estimate</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* RESULTS */}
                                {planResult && (
                                    <div className="mt-10 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 shadow-xl animate-fade-in">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-indigo-600 rounded-xl">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800">AI Analysis Report</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                            <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
                                                <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider">Estimated Cost</p>
                                                <p className="text-3xl font-bold text-green-600">{formatCurrency(planResult.estimate.estimated_cost_lakhs)}</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
                                                <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider">Total Area</p>
                                                <p className="text-3xl font-bold text-indigo-600">{planResult.estimate.total_area_sqft} sq.ft</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
                                            <h4 className="text-sm font-bold text-indigo-900 uppercase mb-4 tracking-wider flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                                AI Recommendations
                                            </h4>
                                            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {planResult.explanation}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiAssistantPage;
