import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
                <div className="text-center text-slate-400 mt-10">No messages yet.</div>
            )}
            {messages.map((msg, index) => {
                const isOwnMessage = msg.sender_id === currentUserId;
                return (
                    <div
                        key={index}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-lg shadow-sm ${isOwnMessage
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                }`}
                        >
                            <p className="text-sm">{msg.content || msg.message}</p>
                            {/* Optional: Show sender ID for debug if needed, skipping for cleaner UI */}
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
