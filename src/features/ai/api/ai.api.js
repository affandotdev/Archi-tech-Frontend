import axios from "axios";

// AI Service is running on port 8003
const AI_SERVICE_URL = "http://localhost:8003";

/**
 * Ask the AI for an explanation or advice.
 * @param {string} prompt - The user's query
 * @returns {Promise<string>} - The AI's response text
 */
export const explainRequest = async (prompt) => {
    try {
        // Based on previous debugging, endpoints are /ai/explain or /api/estimate
        // We use the new /ai/chat endpoint for general queries
        const response = await axios.post(`${AI_SERVICE_URL}/ai/chat`, {
            prompt: prompt
        });
        return response.data; // Assuming data contains { explanation: ... } or similar
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

/**
 * Get an estimate with AI explanation from structured inputs.
 * @param {object} projectDetails - Matches EstimateRequest schema (plot_length_ft, etc.)
 */
export const generatePlan = async (projectDetails) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/ai/explain`, projectDetails);
        return response.data;
    } catch (error) {
        console.error("AI Plan Error:", error);
        throw error;
    }
};
