import React from 'react';

const ChatHeader = ({ conversationId, status }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'text-green-500';
            case 'connecting': return 'text-yellow-500';
            case 'error': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">Chat</h2>
                <p className="text-sm text-slate-500">ID: {conversationId}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getStatusColor(status)} capitalize`}>
                    {status}
                </span>
                <div className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            </div>
        </div>
    );
};

export default ChatHeader;
