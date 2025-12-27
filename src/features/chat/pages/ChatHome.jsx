import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../widgets/Navbar/Navbar';
import { getConversations } from '../api/chat.api';
import FollowService from '../../follow/api/follow.api';

const ChatHome = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [conversations, setConversations] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user?.id) return;
            try {
                // Parallel fetch: Connections (for names) and Conversations (for list)
                const [convsData, connsData] = await Promise.all([
                    getConversations(user.id),
                    FollowService.getConnections()
                ]);

                // Connections data might be { connections: [...] } or just [...]
                // Based on previous checks, it likely returns an object with a list or just a list
                // Let's assume list or extract list
                const connsList = Array.isArray(connsData) ? connsData : (connsData.connections || []);

                setConnections(connsList);
                setConversations(convsData);
            } catch (error) {
                console.error("Failed to load chat data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user?.id]);

    const getChatName = (participants) => {
        if (!participants || participants.length === 0) return "Unknown Chat";

        // Find the participant that is NOT me
        // Be careful with type comparisons (string vs number)
        const otherUserId = participants.find(id => String(id) !== String(user.id));

        if (!otherUserId) return "Me"; // Should not happen in normal 2-person chat

        // Find this user in my connections
        // Connection object structure depends on FollowService. 
        // Usually has: { request_id, auth_user_id, full_name, profession, ... }
        // The 'auth_user_id' is the profile ID? Or 'id'? 
        // Let's assume 'auth_user_id' is the UUID based on previous tasks.
        const contact = connections.find(c => String(c.auth_user_id) === String(otherUserId));

        return contact ? contact.full_name : `User ${otherUserId.substring(0, 6)}...`;
    };

    const handleChatClick = (id) => {
        navigate(`/chat/${id}`);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="Messages" user={user} />

            <div className="max-w-2xl mx-auto mt-8 p-4">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Conversations</h1>

                {conversations.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 mb-4">No active conversations yet.</p>
                        <p className="text-sm text-slate-400">Go to "My Network" to start chatting with your connections!</p>
                        <button
                            onClick={() => navigate(user?.role === 'client' ? '/client/dashboard' : '/connections')}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                        >
                            Go to Network
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => handleChatClick(conv.id)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                        {getChatName(conv.participants).charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            {getChatName(conv.participants)}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Click to open chat
                                        </p>
                                    </div>
                                </div>
                                <div className="text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatHome;
