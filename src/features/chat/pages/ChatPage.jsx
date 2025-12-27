import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../../../widgets/Navbar/Navbar';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
    const { conversationId } = useParams();
    const location = useLocation();

    // Use passed state senderId or generate/fallback to a temporary one
    // In a real app, senderId would come from AuthContext
    const user = JSON.parse(localStorage.getItem('user'));
    const senderId = user?.id || 'anonymous-user';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Reusing Navbar if possible, otherwise simple header */}
            <div className="mb-4">
                <Navbar title="Chat Room" user={user} />
            </div>

            <div className="flex-1 px-4 pb-4 flex justify-center">
                <ChatWindow conversationId={conversationId} senderId={senderId} />
            </div>
        </div>
    );
};

export default ChatPage;
