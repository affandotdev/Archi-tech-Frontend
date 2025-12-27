import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FollowService from "../api/follow.api";
import { getOrCreateConversation } from "../../chat/api/chat.api";
import Navbar from "../../../widgets/Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";

export default function ConnectionApprovals() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("requests");
    const [requests, setRequests] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === "requests") {
            fetchRequests();
        } else {
            fetchConnections();
        }
    }, [activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await FollowService.getPendingRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load connection requests", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConnections = async () => {
        setLoading(true);
        try {
            const data = await FollowService.getConnections();
            setConnections(data);
        } catch (error) {
            console.error("Failed to load connections", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, action) => {
        try {
            await FollowService.respondToRequest(requestId, action);
            setRequests((prev) => prev.filter((req) => req.id !== requestId));
            alert(`Request ${action === 'approve' ? 'Approved' : 'Rejected'} successfully`);
        } catch (error) {
            console.error("Failed to respond to request", error);
            alert("Action failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar user={user} title="Network Manager" />

            <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">My Network</h1>
                        <p className="text-slate-500 mt-2">Manage your professional connections and requests.</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`${activeTab === "requests"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Connection Requests
                            {requests.length > 0 && <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2.5 rounded-full text-xs font-bold">{requests.length}</span>}
                        </button>
                        <button
                            onClick={() => setActiveTab("connections")}
                            className={`${activeTab === "connections"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Active Connections
                        </button>
                    </nav>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading...</div>
                ) : activeTab === "requests" ? (
                    <RequestsList requests={requests} handleAction={handleAction} />
                ) : (
                    <ConnectionsList connections={connections} setConnections={setConnections} />
                )}
            </div>
        </div>
    );
}

function RequestsList({ requests, handleAction }) {
    if (requests.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900">No Pending Requests</h3>
                <p className="text-slate-500 mt-1">You're all caught up! Check back later for new opportunities.</p>
            </div>
        );
    }
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
            <ul className="divide-y divide-slate-200">
                {requests.map((req) => (
                    <li key={req.id}>
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar src={req.requester_avatar} name={req.requester_name} />
                                <div>
                                    <p className="text-lg font-medium text-indigo-600 truncate">{req.requester_name || "Unknown User"}</p>
                                    <p className="flex items-center text-sm text-slate-500">
                                        Requested on {new Date(req.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-bold">{req.requester_role || "Client"}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction(req.id, "approve")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, "reject")}
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}



const Avatar = ({ src, name, size = "md" }) => {
    const sizeClasses = size === "lg" ? "w-20 h-20 text-2xl" : "w-12 h-12 text-lg";

    if (src) {
        return <img className={`${sizeClasses} rounded-full object-cover border border-slate-200`} src={src} alt="" />;
    }
    return (
        <div className={`${sizeClasses} rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200`}>
            {(name || "U").charAt(0)}
        </div>
    );
};

function ConnectionsList({ connections, setConnections }) { // Accept setConnections to update state locally
    const navigate = useNavigate();
    const { user } = useAuth();

    if (connections.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900">No Connections Yet</h3>
                <p className="text-slate-500 mt-1">Start connecting with professionals or clients to build your network.</p>
            </div>
        );
    }

    const handleMessage = async (targetUserId) => {
        if (!user || !user.id || !targetUserId) return;
        try {
            const conversationId = await getOrCreateConversation([String(user.id), String(targetUserId)]);
            navigate(`/chat/${conversationId}`);
        } catch (error) {
            console.error("Failed to start conversation", error);
            alert("Could not start chat. Please try again.");
        }
    };

    const handleRemove = async (targetUserId, name) => {
        if (!window.confirm(`Are you sure you want to remove ${name} from your connections?`)) return;

        try {
            await FollowService.removeConnection(targetUserId);
            // Optimistically update UI
            if (setConnections) {
                setConnections(prev => prev.filter(c => String(c.auth_user_id) !== String(targetUserId)));
            } else {
                // Fallback if setConnections not passed (though we will update parent to pass it)
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to remove connection", error);
            alert("Failed to remove connection.");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((person) => (
                <div key={person.auth_user_id || person.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition-shadow relative group">
                    {/* Remove Option - top right */}
                    <button
                        onClick={() => handleRemove(person.auth_user_id, person.full_name)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                        title="Remove Connection"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.49 1.478l-.56-.092.443 2.112a14.935 14.935 0 01.378 1.492c.075.39.141.77.2 1.144.17 1.056.284 2.054.34 2.978.02.32.046.686.064 1.026.046.914.07 1.761.07 2.457a.75.75 0 01-1.5 0 16.52 16.52 0 00-.063-2.348 29.349 29.349 0 00-.324-2.836l-1.353-8.895-.295-1.939a.75.75 0 011.082-.782 47.923 47.923 0 003.555-.528zM9 12.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5z" clipRule="evenodd" />
                            <path d="M11.25 19.25a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5z" />
                            {/* Standard trash icon is better */}
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <Avatar src={person.avatar_url} name={person.full_name} size="lg" />
                    <h3 className="mt-4 text-lg font-bold text-slate-900">{person.full_name || "Unknown"}</h3>
                    <p className="text-sm text-indigo-600 font-medium uppercase tracking-wide">{person.role || "User"}</p>
                    <p className="text-slate-500 text-sm mt-1">{person.location || "No Location"}</p>

                    <div className="mt-6 w-full space-y-2">
                        <Link
                            to={`/portfolio/list/${person.auth_user_id}`}
                            className="block w-full py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-center text-sm"
                        >
                            View Portfolio
                        </Link>
                        <button
                            onClick={() => handleMessage(person.auth_user_id)}
                            className="w-full py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            Message
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
