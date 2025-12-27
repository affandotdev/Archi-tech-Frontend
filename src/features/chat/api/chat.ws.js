export const getChatSocketUrl = (conversationId) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Chat Service is running on port 8003
    const host = 'localhost:8003';
    return `${protocol}//${host}/ws/chat/${conversationId}/`;
};
