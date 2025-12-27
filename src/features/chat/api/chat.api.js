import axios from "axios";

// Base URL for Chat Service API (Port 8003)
const CHAT_API_URL = "http://localhost:8003/api/chat";

/**
 * Creates or retrieves an existing conversation between participants
 * @param {Array<string>} participants - List of User UUIDs
 * @returns {Promise<string>} - The conversation UUID
 */
export const getOrCreateConversation = async (participants) => {
    try {
        const response = await axios.post(`${CHAT_API_URL}/conversations/`, {
            participants: participants
        });
        return response.data.id;
    } catch (error) {
        console.error("Failed to get/create conversation:", error);
        throw error;
    }
};

/**
 * Fetches message history for a conversation
 * @param {string} conversationId - The conversation UUID
 * @returns {Promise<Array>} - List of messages
 */
export const getMessages = async (conversationId) => {
    try {
        const response = await axios.get(`${CHAT_API_URL}/messages/${conversationId}/`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        throw error;
    }
};

/**
 * Fetches list of conversations for the current user
 * @param {string} userId - Current User UUID
 * @returns {Promise<Array>} - List of conversations
 */
export const getConversations = async (userId) => {
    try {
        const response = await axios.get(`${CHAT_API_URL}/conversations/list/`, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch conversations:", error);
        throw error;
    }
};
