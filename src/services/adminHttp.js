import axios from "axios";

const adminHttp = axios.create({
    baseURL: "http://localhost:8000",
});

adminHttp.interceptors.request.use((config) => {
    // Try multiple common token keys
    const token =
        localStorage.getItem("access") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("No auth token found in localStorage (checked 'access', 'access_token', 'token')");
    }

    return config;
});

// RESPONSE INTERCEPTOR
adminHttp.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`AdminService Error: ${error.response.status} ${error.response.statusText}`, error.response.data);
        }
        return Promise.reject(error);
    }
);

export default adminHttp;
