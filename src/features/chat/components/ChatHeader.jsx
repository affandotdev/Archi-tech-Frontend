import React from 'react';

const ChatHeader = ({ conversationId, status, onStartCall, callDisabled }) => {
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
            <div className="flex items-center gap-4">
                <button
                    onClick={onStartCall}
                    disabled={callDisabled}
                    className={`p-2 rounded-full transition-colors ${callDisabled ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                    title={callDisabled ? "Cannot call (User offline or unknown)" : "Start Video Call"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263-12.632A3 3 0 0014.25 0h-8.25a3 3 0 00-3 3v8.25a3 3 0 003 3H9m.75-9v9m-3 3h15.75m-15.75 0V15m0 3v3m0-3h15.75m0 0h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-9 3h.008v.008h-.008v-.008zm-6-3h.008v.008h-.008v-.008zm-3 3h.008v.008h-.008v-.008z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getStatusColor(status)} capitalize`}>
                        {status}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
