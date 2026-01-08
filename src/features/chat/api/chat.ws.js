export const getChatSocketUrl = (conversationId) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Chat Service is running on port 8002
    const host = 'localhost:8002';
    return `${protocol}//${host}/ws/chat/${conversationId}/`;
};
