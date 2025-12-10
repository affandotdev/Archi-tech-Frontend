import axios from "axios";

const authHttp = axios.create({
    baseURL: "http://localhost:8000",
});

authHttp.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("access") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

authHttp.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`AuthService Error: ${error.response.status}`, error.response.data);
        }
        return Promise.reject(error);
    }
);

export default authHttp;
