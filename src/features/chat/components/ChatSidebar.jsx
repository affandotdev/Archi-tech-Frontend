import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatSidebar = ({ conversations, connections, currentUserId, activeId, userRole }) => {
    const navigate = useNavigate();

    const getDashboardPath = () => {
        switch (userRole) {
            case 'architect': return '/architect/dashboard';
            case 'engineer': return '/engineer/dashboard';
            case 'admin': return '/admin/dashboard';
            default: return '/client/dashboard';
        }
    };

    const getChatName = (participants) => {
        if (!participants || participants.length === 0) return "Unknown Chat";
        const otherUserId = participants.find(id => String(id) !== String(currentUserId));
        if (!otherUserId) return "Me";

        const contact = connections.find(c => String(c.auth_user_id) === String(otherUserId));
        return contact ? contact.full_name : `User ${otherUserId.substring(0, 6)}...`;
    };

    const getChatAvatar = (participants) => {
        return getChatName(participants).charAt(0).toUpperCase();
    };

    return (
        <div className="h-full overflow-y-auto bg-white">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Messages</h2>
                <button
                    onClick={() => navigate(getDashboardPath())}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                >
                    Dashboard
                </button>
            </div>

            <div className="divide-y divide-slate-50">
                {conversations.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm">
                        No conversations yet.
                    </div>
                ) : (
                    conversations.map((conv) => {
                        const isActive = String(conv.id) === String(activeId);
                        const lastMsg = conv.last_message ? (conv.last_message.content || conv.last_message.message) : "No messages yet";
                        // Truncate message
                        const preview = lastMsg.length > 30 ? lastMsg.substring(0, 30) + "..." : lastMsg;

                        return (
                            <div
                                key={conv.id}
                                onClick={() => navigate(`/chat/${conv.id}`)}
                                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${isActive ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                                        {getChatAvatar(conv.participants)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-sm font-semibold text-slate-800 truncate">
                                                {getChatName(conv.participants)}
                                            </h3>
                                            <span className="text-xs text-slate-400">
                                                {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${isActive ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                                            {preview}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
