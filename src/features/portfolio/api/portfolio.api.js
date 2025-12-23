import axios from "axios";

// Create a specific instance for User Service (Port 8001)
const portfolioHttp = axios.create({
    baseURL: "http://localhost:8001/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add Token
portfolioHttp.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const PortfolioService = {
    // Get public projects for a user
    getUserProjects: async (userId) => {
        const response = await portfolioHttp.get(`users/${userId}/projects/`);
        return response.data;
    },

    // Get single project details
    getProjectById: async (projectId) => {
        const response = await portfolioHttp.get(`projects/${projectId}/`);
        return response.data;
    },

    // Create a new project
    createProject: async (projectData) => {
        const response = await portfolioHttp.post("projects/", projectData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    updateProject: async (id, projectData) => {
        const response = await portfolioHttp.put(`projects/${id}/`, projectData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    deleteProject: async (id) => {
        await portfolioHttp.delete(`projects/${id}/`);
    },

    // Upload images
    uploadProjectImages: async (projectId, images) => {
        const response = await portfolioHttp.post(`projects/${projectId}/images/`, images, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};

export default PortfolioService;
