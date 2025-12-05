import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000/api/auth/",
  headers: { "Content-Type": "application/json" }
});


// 🔥 PUBLIC ENDPOINTS (no token required)
const PUBLIC_ROUTES = [
  "register/",
  "login/",
  "verify-otp/",
  "forgot-password/",
  "reset-password/",
  "oauth/google/",
  "mfa/verify/",
];

// ✅ FIXED → use `Http`, not `http`
http.interceptors.request.use((config) => {
  // Don't attach token to public routes
  const isPublic = PUBLIC_ROUTES.some((route) =>
    config.url.includes(route)
  );
  
  if (!isPublic) {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
