import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../widgets/Navbar/Navbar';
import { explainRequest, generatePlan } from '../api/ai.api';
import { Ruler, Home, Coins, Hammer, MessageSquare, Calculator, Send, Sparkles, Building2, MapPin, CheckCircle2 } from 'lucide-react';

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

// Utility to format currency
const formatCurrency = (lakhs) => {
    if (!lakhs) return '0 Lakhs';
    const value = parseFloat(lakhs);

    if (value >= 100) {
        const crores = (value / 100).toFixed(2);
        return `₹ ${crores} Cr`;
    }
    return `₹ ${value.toFixed(2)} L`;
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
        plot_length_ft: 40,
        plot_width_ft: 30,
        floors: 1,
        location: 'city',
        building_type: 'house',
        quality: 'standard',
        budget_lakhs: 50,
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

    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <div className="shrink-0 z-10 sticky top-0">
                <Navbar title="AI Assistant" user={user} />
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-80px)]">

                {/* Header & Tabs */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-indigo-500" /> AI Architect Assistant
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 ml-1">Powered by advanced AI technology</p>
                    </div>

                    <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'chat'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('planner')}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'planner'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <Calculator className="w-4 h-4" />
                            Planner
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col backdrop-blur-sm">

                    {/* CHAT TAB */}
                    {activeTab === 'chat' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth">
                                {conversation.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-6 py-4 shadow-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                                            }`}>
                                            <p className="text-sm leading-7 whitespace-pre-wrap font-medium">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="flex justify-start animate-in fade-in duration-300">
                                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-6 py-4 flex items-center gap-3 shadow-sm">
                                            <div className="flex gap-1.5">
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-500">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-white">
                                <form onSubmit={handleChatSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Ask about design, costs, or regulations..."
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-inner"
                                        disabled={chatLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={chatLoading || !query.trim()}
                                        className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {/* PLANNER TAB */}
                    {activeTab === 'planner' && (
                        <div className="flex-1 overflow-y-auto bg-slate-50/50">
                            <div className="max-w-5xl mx-auto p-6 md:p-8">

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Left Column: Form */}
                                    <div className="lg:col-span-7 space-y-8">

                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                                                <Calculator className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Project Parameters</h2>
                                                <p className="text-slate-500 text-xs">Define your requirements for AI analysis</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handlePlanSubmit} className="space-y-6">

                                            {/* Plot Dimensions Card */}
                                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Ruler className="w-4 h-4" /> Dimensions
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-sm font-semibold text-slate-700">Length (ft)</label>
                                                            <input
                                                                type="number"
                                                                name="plot_length_ft"
                                                                value={formData.plot_length_ft}
                                                                onChange={handleInputChange}
                                                                className="w-20 text-right font-bold text-indigo-600 border-b-2 border-slate-200 focus:border-indigo-600 outline-none bg-transparent transition-colors"
                                                            />
                                                        </div>
                                                        <input
                                                            type="range"
                                                            name="plot_length_ft"
                                                            min="10"
                                                            max="200"
                                                            value={formData.plot_length_ft}
                                                            onChange={handleSliderChange}
                                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                        />
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-sm font-semibold text-slate-700">Width (ft)</label>
                                                            <input
                                                                type="number"
                                                                name="plot_width_ft"
                                                                value={formData.plot_width_ft}
                                                                onChange={handleInputChange}
                                                                className="w-20 text-right font-bold text-indigo-600 border-b-2 border-slate-200 focus:border-indigo-600 outline-none bg-transparent transition-colors"
                                                            />
                                                        </div>
                                                        <input
                                                            type="range"
                                                            name="plot_width_ft"
                                                            min="10"
                                                            max="200"
                                                            value={formData.plot_width_ft}
                                                            onChange={handleSliderChange}
                                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 font-medium">Total Area</span>
                                                    <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                                                        {(formData.plot_length_ft * formData.plot_width_ft).toLocaleString()} sq.ft
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Building Specs Card */}
                                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Building2 className="w-4 h-4" /> Specifications
                                                </h3>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Floors</label>
                                                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                            <input
                                                                type="range"
                                                                name="floors"
                                                                min="1"
                                                                max="10"
                                                                value={formData.floors}
                                                                onChange={handleSliderChange}
                                                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 ml-2"
                                                            />
                                                            <span className="w-12 h-10 flex items-center justify-center bg-white font-bold text-indigo-600 rounded-lg shadow-sm border border-slate-100 border-b-2">
                                                                {formData.floors}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Type</label>
                                                        <select
                                                            name="building_type"
                                                            value={formData.building_type}
                                                            onChange={handleInputChange}
                                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all"
                                                        >
                                                            <option value="house">Independent House</option>
                                                            <option value="apartment">Apartment Complex</option>
                                                            <option value="villa">Luxury Villa</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Location</label>
                                                        <select
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all"
                                                        >
                                                            <option value="city">Metro City</option>
                                                            <option value="town">Tier-2 Town</option>
                                                            <option value="village">Rural Area</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Budget & Quality Card */}
                                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Coins className="w-4 h-4" /> Budget & Finish
                                                </h3>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Budget</label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative flex-1">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                                            <input
                                                                type="number"
                                                                name="budget_lakhs"
                                                                value={formData.budget_lakhs}
                                                                onChange={handleInputChange}
                                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
                                                                placeholder="Amount"
                                                            />
                                                        </div>
                                                        <div className="flex bg-slate-100 p-1 rounded-xl">
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, budgetUnit: 'lakhs' }))}
                                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${formData.budgetUnit === 'lakhs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                                                            >
                                                                Lakhs
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, budgetUnit: 'crores' }))}
                                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${formData.budgetUnit === 'crores' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                                                            >
                                                                Crores
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 mb-3 uppercase">Finish Quality</label>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {['basic', 'standard', 'premium'].map(q => (
                                                            <button
                                                                key={q}
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, quality: q }))}
                                                                className={`py-3 px-2 rounded-xl border-2 text-sm font-bold capitalize transition-all flex flex-col items-center gap-1 ${formData.quality === q
                                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                                                    : 'border-slate-100 hover:border-indigo-200 text-slate-500 hover:bg-slate-50'
                                                                    }`}
                                                            >
                                                                {q === 'premium' && <Sparkles className="w-4 h-4 mb-1" />}
                                                                {q}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={planLoading}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-md"
                                            >
                                                {planLoading ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Generating Analysis...
                                                    </span>
                                                ) : (
                                                    <>
                                                        Generate Report <Sparkles className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>

                                        </form>
                                    </div>

                                    {/* Right Column: Results */}
                                    <div className="lg:col-span-5">
                                        {planResult ? (
                                            <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-50 overflow-hidden sticky top-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="bg-indigo-600 p-6 flex flex-col items-center text-center text-white">
                                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm">
                                                        <Coins className="w-6 h-6 text-white" />
                                                    </div>
                                                    <p className="text-indigo-100 text-sm font-medium mb-1">Estimated Cost</p>
                                                    <h3 className="text-4xl font-bold">{formatCurrency(planResult.estimate.estimated_cost_lakhs)}</h3>
                                                </div>

                                                <div className="p-6 space-y-6">
                                                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                                        <span className="text-slate-500 text-sm font-medium">Built-Up Area</span>
                                                        <span className="text-slate-800 font-bold">{planResult.estimate.total_area_sqft} sq.ft</span>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-bold text-indigo-900 uppercase mb-4 flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> AI Insights
                                                        </h4>
                                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                                                {planResult.explanation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                                    <Sparkles className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-400">Ready to Analyze</h3>
                                                <p className="text-slate-400 text-sm mt-2 max-w-xs">Fill in your project details and let AI assist you with accurate cost estimations.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiAssistantPage;
