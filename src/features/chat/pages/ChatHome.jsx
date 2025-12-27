import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../widgets/Navbar/Navbar';

const ChatHome = () => {
    const [conversationId, setConversationId] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleJoin = (e) => {
        e.preventDefault();
        if (conversationId.trim()) {
            navigate(`/chat/${conversationId}`);
        }
    };

    const handleStartNew = () => {
        // Logic to start new chat or generate ID
        const newId = crypto.randomUUID();
        navigate(`/chat/${newId}`);
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title="Chat Center" user={user} />

            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Join Conversation</h2>

                <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    <p className="font-semibold mb-1">How to use:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Enter <strong>ANY</strong> ID (e.g., "project-a", "team-chat") to create/join that room.</li>
                        <li>Or click "Start New Chat" to generate a random room ID.</li>
                        <li>Share the ID with others to chat in the same room.</li>
                    </ul>
                </div>

                <form onSubmit={handleJoin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Conversation ID / Room Name
                        </label>
                        <input
                            type="text"
                            value={conversationId}
                            onChange={(e) => setConversationId(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="e.g. my-project-chat"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!conversationId.trim()}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Join Chat
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 mb-4">Or start a fresh conversation</p>
                    <button
                        onClick={handleStartNew}
                        className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                    >
                        Start New Chat (Random ID)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHome;
