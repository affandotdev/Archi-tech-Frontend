import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../../widgets/Navbar/Navbar';
import ChatWindow from '../components/ChatWindow';
import ChatSidebar from '../components/ChatSidebar';
import { getConversations, markConversationAsRead } from '../api/chat.api';
import FollowService from '../../follow/api/follow.api';

const ChatPage = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // Data Loading State
    const [conversations, setConversations] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user?.id) return;
            try {
                if (conversationId) {
                    // Mark messages as read when entering conversation
                    await markConversationAsRead(user.id, conversationId);
                }

                const [convsData, connsData] = await Promise.all([
                    getConversations(user.id),
                    FollowService.getConnections()
                ]);

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
    }, [user?.id, conversationId]); // Refresh when conversation changes to update 'last message' (optional)

    const senderId = user?.id || 'anonymous';

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            <div className="shrink-0 z-10">
                <Navbar title="Chat" user={user} />
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar 
                    Data Logic:
                    - Mobile: If conversationId is set, hide sidebar. Else show full width.
                    - Desktop: Always show sidebar, fixed width.
                */}
                <div className={`${conversationId ? 'hidden md:block' : 'w-full'} md:w-80 shrink-0 h-full border-r border-slate-200 bg-white`}>
                    <ChatSidebar
                        conversations={conversations}
                        connections={connections}
                        currentUserId={user.id}
                        activeId={conversationId}
                        userRole={user?.role}
                    />
                </div>

                {/* Main Content 
                    - Mobile: If conversationId is set, show full width. Else hide.
                    - Desktop: Always show, takes remaining space.
                */}
                <div className={`flex-1 flex flex-col h-full bg-slate-100 ${!conversationId ? 'hidden md:flex' : 'w-full'}`}>
                    {conversationId ? (
                        <div className="h-full flex flex-col">
                            {/* Mobile Back Button Header could go here */}
                            {/* But ChatWindow has header, let's inject a back button there? 
                                 For now, standard ChatWindow.
                             */}
                            {/* Mobile Back Button Header */}
                            <div className="md:hidden bg-white border-b border-slate-200 flex items-center px-4 py-3 sticky top-0 z-20">
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors mr-3"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    <span className="font-semibold text-sm">Back</span>
                                </button>
                                <span className="text-sm font-medium text-slate-400 ml-auto leading-none">
                                    Chat
                                </span>
                            </div>

                            {/* Find Active Conversation & Target User */}
                            {(() => {
                                const activeConv = conversations.find(c => c.id === conversationId);
                                // Fallback: If not found in list (e.g. direct link), we might need to rely on the ID itself if it was constructed deterministically? 
                                // Actually backend ID is UUID.
                                // If not in list, we rely on ChatWindow to load messages but we can't start call easily without target ID.
                                // For now, we assume it's in the list or we can't call.

                                let targetUserId = null;
                                if (activeConv) {
                                    targetUserId = activeConv.participants.find(p => String(p) !== String(user.id));
                                }

                                return (
                                    <ChatWindow
                                        conversationId={conversationId}
                                        senderId={senderId}
                                        targetUserId={targetUserId}
                                    />
                                );
                            })()}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
