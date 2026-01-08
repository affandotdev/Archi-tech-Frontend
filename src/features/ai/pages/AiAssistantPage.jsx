import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../widgets/Navbar/Navbar';
import { explainRequest, generatePlan } from '../api/ai.api';
import { Ruler, Home, Coins, Hammer, MessageSquare, Calculator, Send, Sparkles, Building2, MapPin, CheckCircle2, BookOpen, Download, AlertTriangle, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// Accordion Component for Rules
const RuleAccordion = ({ evidence }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="group bg-white/60 hover:bg-white/90 rounded-xl border border-slate-200 transition-all duration-300 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold italic border transition-colors ${isOpen ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>§</div>
                    <div>
                        <h5 className="text-sm font-bold text-slate-800">Rule {evidence.rule}</h5>
                        {!isOpen && <p className="text-xs text-slate-500 line-clamp-1">{evidence.summary}</p>}
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 pt-0 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed text-justify mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        {evidence.summary}
                    </p>
                </div>
            </div>
        </div>
    );
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

        // Timeout promise after 30 seconds
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 30000)
        );

        try {
            // Race the actual request against the timeout
            const result = await Promise.race([explainRequest(query), timeoutPromise]);

            const rawText = typeof result === 'string' ? result : (result.message || JSON.stringify(result));
            const cleanedText = cleanMarkdown(rawText);
            setConversation(prev => [...prev, { role: 'ai', text: cleanedText }]);
        } catch (error) {
            console.error("AI Service Error:", error);
            let errorMessage = "I apologize, but I'm having trouble connecting to my services right now.";

            if (error.message === "Request timed out") {
                errorMessage = "The request took too long to process. The servers might be busy.";
            }

            setConversation(prev => [...prev, {
                role: 'ai',
                text: errorMessage
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
            console.error("Plan Generation Error:", error);
            const errorMsg = error.response?.data?.detail || "Failed to generate plan. Please try again.";
            alert(errorMsg);
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

    const handleDownloadPDF = () => {
        try {
            if (!planResult) return;

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;

            // Colors
            const primaryColor = [79, 70, 229]; // Indigo-600
            const secondaryColor = [243, 244, 246]; // Gray-100
            const textColor = [51, 65, 85];     // Slate-700

            // Helper: Header
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, pageWidth, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text("AI Architect Construction Report", margin, 20);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 32);

            let yPos = 55;

            // 1. Project Details
            doc.setTextColor(...textColor);
            doc.setFontSize(14);
            doc.text("1. Project Specification", margin, yPos);
            yPos += 8;

            const details = [
                ["Plot Size", `${formData.plot_length_ft}' x ${formData.plot_width_ft}'`],
                ["Total Built-up Area", `${planResult.estimate.total_area_sqft} sq.ft`],
                ["Floors", formData.floors.toString()],
                ["Location Type", formData.location],
                ["Building Type", formData.building_type],
                ["Quality Grade", formData.quality],
                ["Budget", formData.budgetUnit === 'crores' ? `Rs ${formData.budget_lakhs} Cr` : `Rs ${formData.budget_lakhs} Lakhs`]
            ];

            autoTable(doc, {
                startY: yPos,
                head: [['Parameter', 'Value']],
                body: details,
                theme: 'grid',
                headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 3 },
                columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
            });

            yPos = doc.lastAutoTable.finalY + 15;

            // 2. Cost Analysis
            doc.setFontSize(14);
            doc.text("2. Cost Estimation", margin, yPos);
            yPos += 8;

            autoTable(doc, {
                startY: yPos,
                body: [
                    ['Rate per Sq.Ft', `Rs ${planResult.estimate.cost_per_sqft}`],
                    ['Total Estimated Cost', `Rs ${planResult.estimate.estimated_cost_lakhs} Lakhs`]
                ],
                theme: 'plain',
                styles: { fontSize: 12, fontStyle: 'bold', textColor: primaryColor },
                columnStyles: { 1: { halign: 'right' } }
            });

            yPos = doc.lastAutoTable.finalY + 15;

            // 3. AI Analysis & Safety
            if (planResult.explanation) {
                let explanationText = planResult.explanation.replace(/\*\*/g, '').replace(/\*/g, '');
                let safetyText = "";

                // Split extracted Safety Section if present
                if (explanationText.includes("Critical Safety & Awareness")) {
                    const parts = explanationText.split("Critical Safety & Awareness");
                    explanationText = parts[0].replace(/##/g, '').trim();
                    // Clean up the safety text part
                    safetyText = parts[1].trim();
                }

                // Print Main Analysis
                doc.setFontSize(14);
                doc.setTextColor(...textColor);
                doc.text("3. AI Strategic Analysis", margin, yPos);
                yPos += 8;

                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const splitText = doc.splitTextToSize(explanationText, pageWidth - (margin * 2));
                doc.text(splitText, margin, yPos);
                yPos += (splitText.length * 5) + 15;

                // 4. Critical Safety Actions (New Highlighted Section)
                if (safetyText) {
                    if (yPos > 230) { doc.addPage(); yPos = 20; }

                    // Draw Red Box Background
                    const boxHeight = (doc.splitTextToSize(safetyText, pageWidth - (margin * 2)).length * 5) + 20;
                    doc.setFillColor(254, 242, 242); // Red-50
                    doc.setDrawColor(252, 165, 165); // Red-300
                    doc.roundedRect(margin - 5, yPos - 5, pageWidth - (margin * 2) + 10, boxHeight, 3, 3, 'FD');

                    doc.setFontSize(14);
                    doc.setTextColor(220, 38, 38); // Red-600
                    doc.setFont("helvetica", "bold");
                    doc.text("4. Critical Safety & Awareness", margin, yPos + 5);
                    yPos += 12;

                    doc.setFontSize(10);
                    doc.setTextColor(...textColor);
                    doc.setFont("helvetica", "normal");

                    const splitSafety = doc.splitTextToSize(safetyText, pageWidth - (margin * 2));
                    doc.text(splitSafety, margin, yPos);
                    yPos += boxHeight + 10;
                }
            }

            // 4. Building Rules - NEW
            if (planResult.rag_evidence && planResult.rag_evidence.length > 0) {
                // Check for page break
                if (yPos > 250) { doc.addPage(); yPos = 20; }

                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("4. Verified Regulations (KPBR/KMBR)", margin, yPos);
                yPos += 8;

                const rulesData = planResult.rag_evidence.map(r => [`Rule ${r.rule}`, r.summary]);

                autoTable(doc, {
                    startY: yPos,
                    head: [['Rule No.', 'Description']],
                    body: rulesData,
                    theme: 'striped',
                    headStyles: { fillColor: [16, 185, 129] }, // Emerald color for rules
                    styles: { fontSize: 9, cellPadding: 4 },
                    columnStyles: { 0: { fontStyle: 'bold', width: 30 } } // Narrow column for rule number
                });

                yPos = doc.lastAutoTable.finalY + 15;
            }

            // 5. Risks & Assumptions
            // Check for page break
            if (yPos > 240) { doc.addPage(); yPos = 20; }

            if (planResult.estimate.risks?.length > 0) {
                doc.setFontSize(14);
                doc.setTextColor(220, 38, 38); // Red for risk
                doc.text("5. Risk Factors", margin, yPos);
                yPos += 8;
                doc.setFontSize(10);
                doc.setTextColor(...textColor);
                planResult.estimate.risks.forEach(r => {
                    doc.text(`• ${r}`, margin + 5, yPos);
                    yPos += 6;
                });
            }

            doc.save("ArchiTech_Cost_Estimate.pdf");
        } catch (error) {
            console.error("PDF Failed:", error);
            alert("Could not generate PDF. Please try again.");
        }
    };



    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-50/40 to-pink-100/40 pointer-events-none fixed" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 fixed" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2 fixed" />

            <div className="shrink-0 z-20 sticky top-0">
                <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm" />
                <div className="relative">
                    <Navbar title="AI Assistant" user={user} />
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col z-10 relative">

                {/* Header & Tabs */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 drop-shadow-sm">
                            <Sparkles className="w-8 h-8 text-indigo-500 fill-indigo-100" /> AI Architect
                        </h1>
                        <p className="text-slate-500 font-medium mt-1 ml-1 text-sm tracking-wide">Intelligent Construction Intelligence Engine</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-lg shadow-indigo-500/5 flex items-center gap-1 sticky top-24 z-30">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'chat'
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                                : 'text-slate-500 hover:bg-white/50 hover:text-indigo-600'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Consultant
                        </button>
                        <button
                            onClick={() => setActiveTab('planner')}
                            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'planner'
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                                : 'text-slate-500 hover:bg-white/50 hover:text-indigo-600'
                                }`}
                        >
                            <Calculator className="w-4 h-4" />
                            Planner
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-indigo-200/40 border border-white/60 flex flex-col relative min-h-[600px]">

                    {/* CHAT TAB */}
                    {activeTab === 'chat' && (
                        <>
                            <div className="flex-1 p-6 space-y-6">
                                {conversation.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-6 py-4 shadow-lg ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-br-none shadow-indigo-500/20'
                                            : 'bg-white/80 backdrop-blur-sm border border-white/60 text-slate-700 rounded-bl-none shadow-slate-200/50'
                                            }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium tracking-wide opacity-95">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="flex justify-start animate-in fade-in duration-300">
                                        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl rounded-bl-none px-6 py-5 flex items-center gap-3 shadow-sm">
                                            <div className="flex gap-1.5">
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-500">Processing...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="sticky bottom-0 p-4 border-t border-white/50 bg-white/70 backdrop-blur-xl rounded-b-[2.5rem]">
                                <form onSubmit={handleChatSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Ask about design, costs, or regulations..."
                                        className="w-full bg-white/70 border-0 text-slate-800 text-sm rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-400 shadow-inner"
                                        disabled={chatLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={chatLoading || !query.trim()}
                                        className="absolute right-2 p-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {/* PLANNER TAB */}
                    {activeTab === 'planner' && (
                        <div className="p-6 md:p-10">
                            {/* ... Content remains same ... */}
                            <div className="max-w-6xl mx-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    {/* Left Column: Form */}
                                    <div className="lg:col-span-7 space-y-8">
                                        {/* ... Form Content ... */}
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="p-3 bg-indigo-100/50 backdrop-blur-sm text-indigo-600 rounded-2xl shadow-inner">
                                                <Calculator className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Parameters</h2>
                                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Define Constraints</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handlePlanSubmit} className="space-y-6">
                                            {/* Plot Dimensions Card */}
                                            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-indigo-100/20 border border-white/60 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500 group">
                                                {/* ... Inputs ... */}
                                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-6 group-hover:text-indigo-600 transition-colors">
                                                    <Ruler className="w-4 h-4" /> Dimensions
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center px-1">
                                                            <label className="text-sm font-bold text-slate-700">Length (ft)</label>
                                                            <div className="relative group/input">
                                                                <input type="number" name="plot_length_ft" value={formData.plot_length_ft} onChange={handleInputChange} className="w-24 text-right font-bold text-indigo-600 border-b-2 border-indigo-100 focus:border-indigo-600 outline-none bg-transparent transition-colors py-1" />
                                                            </div>
                                                        </div>
                                                        <input type="range" name="plot_length_ft" min="10" max="200" value={formData.plot_length_ft} onChange={handleSliderChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center px-1">
                                                            <label className="text-sm font-bold text-slate-700">Width (ft)</label>
                                                            <div className="relative group/input">
                                                                <input type="number" name="plot_width_ft" value={formData.plot_width_ft} onChange={handleInputChange} className="w-24 text-right font-bold text-indigo-600 border-b-2 border-indigo-100 focus:border-indigo-600 outline-none bg-transparent transition-colors py-1" />
                                                            </div>
                                                        </div>
                                                        <input type="range" name="plot_width_ft" min="10" max="200" value={formData.plot_width_ft} onChange={handleSliderChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="pt-6 mt-6 border-t border-indigo-50 flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 font-semibold tracking-wide">Total Plot Area</span>
                                                    <span className="font-bold text-indigo-900 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">{(formData.plot_length_ft * formData.plot_width_ft).toLocaleString()} sq.ft</span>
                                                </div>
                                            </div>

                                            {/* Building Specs Card */}
                                            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-indigo-100/20 border border-white/60 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500 group">
                                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-6 group-hover:text-indigo-600 transition-colors"><Building2 className="w-4 h-4" /> Usage & Specs</h3>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Number of Floors</label>
                                                        <div className="flex items-center gap-6 bg-white/50 p-3 rounded-2xl border border-white/60 shadow-inner">
                                                            <input type="range" name="floors" min="1" max="10" value={formData.floors} onChange={handleSliderChange} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all ml-2" />
                                                            <span className="w-14 h-12 flex items-center justify-center bg-white font-bold text-xl text-indigo-600 rounded-xl shadow-lg border border-indigo-50">{formData.floors}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Classification</label>
                                                        <div className="relative">
                                                            <select name="building_type" value={formData.building_type} onChange={handleInputChange} className="w-full p-4 bg-white/50 border border-white/60 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none shadow-sm cursor-pointer hover:bg-white/80">
                                                                <option value="house">Independent House</option><option value="apartment">Apartment Complex</option><option value="villa">Luxury Villa</option>
                                                            </select>
                                                            <Home className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Development Zone</label>
                                                        <div className="relative">
                                                            <select name="location" value={formData.location} onChange={handleInputChange} className="w-full p-4 bg-white/50 border border-white/60 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none shadow-sm cursor-pointer hover:bg-white/80">
                                                                <option value="city">Metro City</option><option value="town">Tier-2 Town</option><option value="village">Rural Area</option>
                                                            </select>
                                                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Budget & Quality Card */}
                                            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-indigo-100/20 border border-white/60 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500 group">
                                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-6 group-hover:text-indigo-600 transition-colors"><Coins className="w-4 h-4" /> Financials</h3>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Estimated Budget</label>
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative flex-1 group/input">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within/input:text-indigo-500 transition-colors">₹</span>
                                                                <input type="number" name="budget_lakhs" value={formData.budget_lakhs} onChange={handleInputChange} className="w-full pl-10 pr-4 py-4 bg-white/50 border border-white/60 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner" placeholder="Amount" />
                                                            </div>
                                                            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl">
                                                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, budgetUnit: 'lakhs' }))} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${formData.budgetUnit === 'lakhs' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Lakhs</button>
                                                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, budgetUnit: 'crores' }))} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${formData.budgetUnit === 'crores' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Crores</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Finish Grade</label>
                                                        <div className="grid grid-cols-3 gap-4">
                                                            {['basic', 'standard', 'premium'].map(q => (
                                                                <button key={q} type="button" onClick={() => setFormData(prev => ({ ...prev, quality: q }))} className={`py-4 px-2 rounded-2xl border-2 text-sm font-bold capitalize transition-all duration-300 flex flex-col items-center gap-2 ${formData.quality === q ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-500/20 scale-105' : 'border-transparent bg-white/50 text-slate-500 hover:bg-white hover:shadow-md'}`}>
                                                                    {q === 'basic' && <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                                                                    {q === 'standard' && <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /></div>}
                                                                    {q === 'premium' && <Sparkles className="w-4 h-4 text-amber-500" />}
                                                                    {q}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="submit" disabled={planLoading} className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 text-lg transform hover:-translate-y-1 hover:shadow-2xl">
                                                {planLoading ? (<span className="flex items-center gap-3"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Simulating Construction Logic...</span>) : (<>Generate Intelligence Report <Sparkles className="w-5 h-5 animate-pulse" /></>)}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Right Column: Results */}
                                    <div className="lg:col-span-5">
                                        {planResult ? (
                                            <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                                                {/* Hero Card */}
                                                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700" />
                                                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-900/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
                                                    <button onClick={handleDownloadPDF} className="absolute top-6 right-6 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-md border border-white/10 group-hover:border-white/30 cursor-pointer shadow-lg" title="Download Report"><Download className="w-5 h-5 text-white" /></button>
                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10 shadow-inner"><Coins className="w-7 h-7 text-white" /></div>
                                                        <p className="text-indigo-100 font-medium tracking-wide mb-1 uppercase text-xs">Total Estimated Cost</p>
                                                        <h3 className="text-5xl font-extrabold tracking-tight mb-6">{formatCurrency(planResult.estimate.estimated_cost_lakhs)}</h3>
                                                        <div className="w-full bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/5 flex justify-between items-center">
                                                            <div className="text-left"><p className="text-indigo-200 text-xs uppercase font-bold">Built-Up Area</p><p className="font-bold text-lg">{planResult.estimate.total_area_sqft} <span className="text-sm font-medium opacity-70">sq.ft</span></p></div>
                                                            <div className="h-8 w-px bg-white/20" />
                                                            <div className="text-right"><p className="text-indigo-200 text-xs uppercase font-bold">Unit Rate</p><p className="font-bold text-lg">₹ {planResult.estimate.cost_per_sqft} <span className="text-sm font-medium opacity-70">/sq.ft</span></p></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Details Panel */}
                                                <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-xl shadow-indigo-100/30 overflow-hidden">
                                                    <div className="p-8 space-y-8">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-indigo-900 uppercase flex items-center gap-2 mb-4"><Sparkles className="w-4 h-4 text-indigo-500" /> AI Strategic Analysis</h4>
                                                            <div className="bg-gradient-to-br from-white to-indigo-50/50 p-6 rounded-2xl border border-white shadow-sm text-slate-600 text-sm leading-7">{planResult.explanation}</div>
                                                        </div>
                                                        {planResult.rag_evidence && planResult.rag_evidence.length > 0 && (
                                                            <div>
                                                                <div className="flex items-center justify-between mb-4"><h4 className="text-xs font-bold text-indigo-900 uppercase flex items-center gap-2"><BookOpen className="w-4 h-4 text-emerald-500" /> Verified Regulations</h4><span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">KPBR Compliant</span></div>
                                                                <div className="space-y-4">
                                                                    {planResult.rag_evidence.map((evidence, idx) => (
                                                                        <RuleAccordion key={idx} evidence={evidence} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                                            {planResult.estimate.assumptions && (<div className="space-y-3"><h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assumptions</h4><ul className="space-y-2">{planResult.estimate.assumptions.map((item, i) => (<li key={i} className="flex items-start gap-2 text-xs text-slate-500 leading-tight"><span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />{item}</li>))}</ul></div>)}
                                                            {planResult.estimate.risks && planResult.estimate.risks.length > 0 && (<div className="space-y-3"><h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Risk Factors</h4><ul className="space-y-2">{planResult.estimate.risks.map((item, i) => (<li key={i} className="flex items-start gap-2 text-xs text-slate-500 leading-tight bg-amber-50/50 p-2 rounded-lg border border-amber-100/50"><AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />{item}</li>))}</ul></div>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-[500px] sticky top-24 flex flex-col items-center justify-center p-12 text-center bg-white/40 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-white/50 group hover:bg-white/50 transition-colors">
                                                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-100 to-white rounded-full shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"><Sparkles className="w-10 h-10 text-indigo-300 group-hover:text-indigo-500 transition-colors" /></div>
                                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Simulate</h3>
                                                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">Enter your plot details and requirements on the left to generate a comprehensive AI-powered construction analysis.</p>
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
