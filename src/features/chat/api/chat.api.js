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

/**
 * Registers the FCM token for push notifications
 * @param {string} userId - Current User UUID
 * @param {string} token - FCM Device Token
 */
export const registerFcmToken = async (userId, token) => {
    try {
        await axios.post(`${CHAT_API_URL}/fcm/register/`, {
            user_id: userId,
            token: token
        });
        console.log("FCM Token registered with backend");
    } catch (error) {
        console.error("Failed to register FCM token:", error);
    }
};

/**
 * Fetches notifications for the user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getNotifications = async (userId) => {
    try {
        const response = await axios.get(`${CHAT_API_URL}/notifications/list/`, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return [];
    }
};

/**
 * Marks a notification as read
 * @param {number} notificationId
 */
export const markNotificationAsRead = async (notificationId) => {
    try {
        await axios.post(`${CHAT_API_URL}/notifications/${notificationId}/read/`);
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
    }
};

/**
 * Marks all notifications for a conversation as read
 * @param {string} userId
 * @param {string} conversationId
 */
export const markConversationAsRead = async (userId, conversationId) => {
    try {
        await axios.post(`${CHAT_API_URL}/notifications/read/`, {
            user_id: userId,
            conversation_id: conversationId
        });
    } catch (error) {
        console.error("Failed to mark conversation as read:", error);
    }
};
