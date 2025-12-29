import { useState, useRef, useEffect, useCallback } from 'react';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
    ]
};

export const useWebRTC = ({ sendMessage, userId, onCallEnd }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callStatus, setCallStatus] = useState('idle'); 
    const [incomingCaller, setIncomingCaller] = useState(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);

    // Initialize Peer Connection
    const createPeerConnection = useCallback(() => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendMessage({
                    type: 'webrtc.ice',
                    payload: event.candidate,
                    to: incomingCaller || pc.remoteUser // We need to track who we are talking to
                });
            }
        };

        pc.ontrack = (event) => {
            console.log("Remote track received", event.streams[0]);
            setRemoteStream(event.streams[0]);
        };

        pc.onconnectionstatechange = () => {
            console.log("Connection state:", pc.connectionState);
            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                endCall();
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [sendMessage, incomingCaller]);

    // Start Call (Offer)
    const startCall = async (targetUserId) => {
        try {
            setCallStatus('outgoing');
            // Hack/Optimization: Store target temporarily on the PC object or Ref if needed
            // But ideally we pass it. For now let's rely on upper layer or local state.
            // Actually, we need to send "call.start" signaling first usually? 
            // Or just jump to WebRTC offer. 
            // Let's do: call.start -> (User Accepts) -> webrtc.offer
            // But for simplicity: Start with local stream & Offer immediately or wait?
            // "Standard" flow: 
            // 1. Caller: startCall -> sends "call.start"
            // 2. Callee: Gets "call.start" -> Shows Incoming Modal
            // 3. Callee: Accepts -> sends "call.accept"
            // 4. Caller: Gets "call.accept" -> Creates Offer -> sends "webrtc.offer"

            // Let's implement this "Ring" phase flow.

            sendMessage({
                type: 'call.start',
                to: targetUserId,
                payload: {}
            });

            // We don't verify peer yet/get stream yet until they accept? 
            // Or we can get local stream ready.
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;

        } catch (err) {
            console.error("Error starting call:", err);
            setCallStatus('idle');
        }
    };

    // Accept Call
    const acceptCall = async (callerId) => {
        try {
            setCallStatus('active');
            setIncomingCaller(callerId); // Ensure we know who we are talking to

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;

            sendMessage({
                type: 'call.accept',
                to: callerId,
                payload: {}
            });


        } catch (err) {
            console.error("Error accepting call:", err);
            endCall();
        }
    };

    const rejectCall = (callerId) => {
        sendMessage({
            type: 'call.reject',
            to: callerId,
            payload: {}
        });
        setCallStatus('idle');
        setIncomingCaller(null);
    };

    const endCall = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        setLocalStream(null);
        setRemoteStream(null);
        setCallStatus('idle');
        setIncomingCaller(null);

        // Notify other peer if we were active
        // But we don't know who "other peer" is easily if we didn't store it well.
        // Assuming 'incomingCaller' or passed 'targetUserId' from UI context?
        // We'll rely on UI to pass target if needed, or broadcast 'call.end'.

        // Simplest: Send call.end to everyone/current peer?
        // We'll expose a function that UI calls with targetId if known.
        if (onCallEnd) onCallEnd();
    };

    // Internal: Create Offer
    const createOffer = async (targetUserId) => {
        const pc = createPeerConnection();
        pc.remoteUser = targetUserId; // Attach for ICE candidates

        // Add tracks
        localStreamRef.current.getTracks().forEach(track => {
            pc.addTrack(track, localStreamRef.current);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        sendMessage({
            type: 'webrtc.offer',
            to: targetUserId,
            payload: offer
        });
    };

    // Internal: Create Answer
    const createAnswer = async (targetUserId, offer) => {
        const pc = createPeerConnection();
        pc.remoteUser = targetUserId;

        // Add tracks (Answerer must also add tracks to be seen)
        localStreamRef.current.getTracks().forEach(track => {
            pc.addTrack(track, localStreamRef.current);
        });

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        sendMessage({
            type: 'webrtc.answer',
            to: targetUserId,
            payload: answer
        });
    };

    // Handle Incoming Signals
    const handleSignal = async (signal) => {
        // If we ignore messages not for us (handled by UI filtering ideally, but safeguard here)
        // Normalize to strings for comparison
        if (signal.to && String(signal.to) !== String(userId)) return;

        const { type, from, payload } = signal;

        switch (type) {
            case 'call.start':
                if (callStatus !== 'idle') {
                    // Busy? Auto-reject or notify
                    sendMessage({ type: 'call.reject', to: from, payload: { reason: 'busy' } });
                    return;
                }
                setIncomingCaller(from);
                setCallStatus('incoming');
                break;

            case 'call.accept':
                if (callStatus === 'outgoing') {
                    setCallStatus('active');
                    // Initiate WebRTC Offer
                    await createOffer(from);
                }
                break;

            case 'call.reject':
                setCallStatus('idle');
                alert('User rejected the call.');
                endCall();
                break;

            case 'call.end':
                endCall();
                break;

            case 'webrtc.offer':
                if (callStatus === 'active' || callStatus === 'incoming') {
                    // Incoming might be skipped if we accepted -> went active -> got offer.
                    // Or if we just auto-accepted?
                    // Ensure we are in a state to accept offer.
                    setCallStatus('active'); // Confirm active
                    await createAnswer(from, payload);
                }
                break;

            case 'webrtc.answer':
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload));
                }
                break;

            case 'webrtc.ice':
                if (peerConnectionRef.current) {
                    try {
                        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload));
                    } catch (e) {
                        console.error("Error adding ICE:", e);
                    }
                }
                break;
        }
    };



    const toggleAudio = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsAudioEnabled(prev => !prev);
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoEnabled(prev => !prev);
        }
    };

    return {
        localStream,
        remoteStream,
        callStatus,
        incomingCaller,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        handleSignal,
        isAudioEnabled,
        isVideoEnabled,
        toggleAudio,
        toggleVideo
    };
};
