import { useRef, useEffect, useState, useCallback } from 'react';
import { getChatSocketUrl } from '../api/chat.ws';

export const useChatSocket = (conversationId, senderId) => {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('disconnected');
    const socketRef = useRef(null);

    useEffect(() => {
        // Validation
        if (!conversationId || !senderId) {
            return;
        }

        const url = getChatSocketUrl(conversationId);
        console.log(`[useChatSocket] Initializing connection to: ${url}`);
        setStatus('connecting');

        // Create new socket
        const ws = new WebSocket(url);

        // Assign to ref immediately so sendMessage can use it if needed (though it should wait for open)
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("[useChatSocket] WebSocket Connected");
            if (socketRef.current === ws) {
                setStatus('connected');
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("[useChatSocket] Received:", data);
                if (data.message || data.content) {
                    setMessages((prev) => [...prev, data]);
                } else if (data.error) {
                    console.error("[useChatSocket] Backend Error:", data.error);
                }
            } catch (err) {
                console.error("[useChatSocket] Error parsing message:", err);
            }
        };

        ws.onerror = (error) => {
            console.error("[useChatSocket] WebSocket Error:", error);
        };

        ws.onclose = (event) => {
            console.log(`[useChatSocket] WebSocket Closed: Code ${event.code}`);
            if (socketRef.current === ws) {
                setStatus('disconnected');
                socketRef.current = null;
            }
        };

        // Cleanup: Close THIS specific socket instance
        return () => {
            console.log("[useChatSocket] Cleanup triggered. Closing socket.");
            ws.close();
            // Only detach ref if it still points to this socket
            if (socketRef.current === ws) {
                socketRef.current = null;
            }
        };
    }, [conversationId, senderId]);

    const sendMessage = useCallback((content) => {
        const ws = socketRef.current;
        console.log("[useChatSocket] Attempting send. Content:", content, "ReadyState:", ws?.readyState);

        if (ws && ws.readyState === WebSocket.OPEN) {
            const payload = {
                message: content,
                sender_id: senderId
            };
            ws.send(JSON.stringify(payload));
        } else {
            console.warn("[useChatSocket] Cannot send: Socket not OPEN. Current state:", ws?.readyState);
        }
    }, [senderId]);

    return { messages, status, sendMessage };
};
