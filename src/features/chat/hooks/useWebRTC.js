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

    // Helper to cleanup media streams
    const cleanupMedia = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            localStreamRef.current = null;
        }
        setLocalStream(null);
    }, []);

    // Initialize Peer Connection
    const createPeerConnection = useCallback(() => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendMessage({
                    type: 'webrtc.ice',
                    payload: event.candidate,
                    to: incomingCaller || pc.remoteUser
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
        if (callStatus === 'outgoing' || callStatus === 'active') return;

        try {
            cleanupMedia(); // Ensure clean slate
            setCallStatus('outgoing');

            // Get stream BEFORE signaling to avoid race condition where they accept before we have stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;

            sendMessage({
                type: 'call.start',
                to: targetUserId,
                payload: {}
            });

        } catch (err) {
            console.error("Error starting call:", err);
            setCallStatus('idle');
            alert("Could not access camera/microphone. Please ensure permissions are granted.");
            cleanupMedia();
        }
    };

    // Accept Call
    const acceptCall = async (callerId) => {
        if (callStatus === 'active') return;

        try {
            cleanupMedia(); // Ensure clean slate
            setCallStatus('active');
            setIncomingCaller(callerId);

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
            // Specific handling for "Device in use"
            if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                alert("Camera or Microphone is already in use by another application. Please close it and try again.");
            } else {
                alert("Failed to access camera/microphone.");
            }
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

    const endCall = useCallback(() => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        cleanupMedia();

        setRemoteStream(null);
        setCallStatus('idle');
        setIncomingCaller(null);

        if (onCallEnd) onCallEnd();
    }, [cleanupMedia, onCallEnd]);

    // Internal: Create Offer
    const createOffer = async (targetUserId) => {
        if (!localStreamRef.current) return;

        const pc = createPeerConnection();
        pc.remoteUser = targetUserId;

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
        if (!localStreamRef.current) return;

        const pc = createPeerConnection();
        pc.remoteUser = targetUserId;

        // Add tracks
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
        if (signal.to && String(signal.to) !== String(userId)) return;

        const { type, from, payload } = signal;

        switch (type) {
            case 'call.start':
                if (callStatus !== 'idle') {
                    sendMessage({ type: 'call.reject', to: from, payload: { reason: 'busy' } });
                    return;
                }
                setIncomingCaller(from);
                setCallStatus('incoming');
                break;

            case 'call.accept':
                if (callStatus === 'outgoing') {
                    setCallStatus('active');
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
                    setCallStatus('active');
                    // Safety check: if we somehow don't have a stream yet (race condition), wait or fail
                    if (!localStreamRef.current) {
                        console.warn("Received offer but no local stream ready. Waiting for user accept?");
                        // If we are in 'incoming' state here, it means the other side sent offer BEFORE we accepted?
                        // That shouldn't happen in our flow (Offer sent AFTER accept). 
                        // But if it does, we can't answer without tracks usually if we want 2-way.
                        return;
                    }
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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupMedia();
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [cleanupMedia]);

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
