import React, { useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import VideoCallModal from './VideoCallModal';
import { useState, useEffect } from "react";
import { getMessages } from "../api/chat.api";
import { useChatSocket } from '../hooks/useChatSocket';
import { useWebRTC } from '../hooks/useWebRTC';

const ChatWindow = ({ conversationId, senderId, targetUserId }) => {
    // 1. We need 'sendMessage' from socket BEFORE we init WebRTC?
    // Actually useWebRTC needs it. 
    // And useChatSocket needs a callback from us.
    // This creates a slight circular dependency if not careful.
    // Solution: useChatSocket gives us 'sendMessage'. We pass that to useWebRTC.
    // useChatSocket calls 'onMessage' which we pass to useWebRTC.handleSignal.

    // We lift the onMessage handler to be stable
    const [lastSignal, setLastSignal] = useState(null);

    const onJsonMessage = useCallback((data) => {
        if (data.type && (data.type.startsWith('call.') || data.type.startsWith('webrtc.'))) {
            setLastSignal(data);
        }
    }, []);

    const { messages: socketMessages, status, sendMessage } = useChatSocket(conversationId, senderId, onJsonMessage);

    const {
        localStream, remoteStream, callStatus, incomingCaller,
        startCall, acceptCall, rejectCall, endCall, handleSignal,
        toggleAudio, toggleVideo, isAudioEnabled, isVideoEnabled
    } = useWebRTC({
        sendMessage,
        userId: senderId,
        onCallEnd: () => console.log("Call ended")
    });

    // Effect to pipe signals to WebRTC hook
    useEffect(() => {
        if (lastSignal) {
            handleSignal(lastSignal);
            setLastSignal(null); // Clear after handling
        }
    }, [lastSignal, handleSignal]);

    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (conversationId) {
            getMessages(conversationId).then(setHistory).catch(console.error);
        }
    }, [conversationId]);

    const allMessages = [...history, ...socketMessages];

    // Determine other user's ID for startCall (naive: we assume 1-on-1 and need to find 'not me')
    // Ideally ChatWindow should know the participant. 
    // For now we might look at MessageList participants or just wait for incoming?
    // Start Call requires a targetId.
    // Hack: We don't have targetId readily available in props.
    // We can infer it from the conversation list if we had it, but we only have history.
    // Let's assume the user clicks "Call" and we find the target from the last message? 
    // Or we should pass 'participants' to ChatWindow.
    // For now, let's just enable "Start Call" if we can guess the target or if it's 1-on-1 logic.
    // We'll leave targetId empty for startCall and handle it? 
    // No, we need targetId.

    // Let's pass 'participants' to ChatWindow from ChatPage. 
    // But for this step I will just add the Modal and Header first.
    // I'll update ChatPage to pass 'targetUserId'.

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-h-[800px] w-full max-w-4xl mx-auto border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white relative">
            <ChatHeader
                conversationId={conversationId}
                status={status}
                onStartCall={() => {
                    if (targetUserId) startCall(targetUserId);
                    else alert("Cannot call: Target user not found.");
                }}
            />

            <MessageList messages={allMessages} currentUserId={senderId} />

            <MessageInput
                onSendMessage={sendMessage}
                disabled={status !== 'connected'}
            />

            <VideoCallModal
                localStream={localStream}
                remoteStream={remoteStream}
                callStatus={callStatus}
                callerName={callStatus === 'outgoing' ? targetUserId : incomingCaller}
                onAccept={() => acceptCall(incomingCaller)}
                onReject={() => rejectCall(incomingCaller)}
                onEnd={endCall}
                onToggleAudio={toggleAudio}
                onToggleVideo={toggleVideo}
                isAudioEnabled={isAudioEnabled}
                isVideoEnabled={isVideoEnabled}
            />
        </div>
    );
};

export default ChatWindow;
