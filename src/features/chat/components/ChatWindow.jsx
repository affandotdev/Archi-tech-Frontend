import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useState, useEffect } from "react";
import { getMessages } from "../api/chat.api";
import { useChatSocket } from '../hooks/useChatSocket';

const ChatWindow = ({ conversationId, senderId }) => {
    const { messages: socketMessages, status, sendMessage } = useChatSocket(conversationId, senderId);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (conversationId) {
            getMessages(conversationId).then(setHistory).catch(console.error);
        }
    }, [conversationId]);

    // Merge history and real-time messages
    // Note: This simple merge assumes history is static since load. 
    // In a real app, you might want to de-duplicate based on IDs.
    const allMessages = [...history, ...socketMessages];

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-h-[800px] w-full max-w-4xl mx-auto border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white">
            <ChatHeader conversationId={conversationId} status={status} />
            <MessageList messages={allMessages} currentUserId={senderId} />
            <MessageInput
                onSendMessage={sendMessage}
                disabled={status !== 'connected'}
            />
        </div>
    );
};

export default ChatWindow;
