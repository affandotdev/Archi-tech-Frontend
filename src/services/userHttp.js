// import axios from "axios";

// const userHttp = axios.create({
//   baseURL: "http://localhost:8001",
// });

// // PUBLIC ROUTES for user service
// const PUBLIC_ROUTES = [];

// // REQUEST INTERCEPTOR
// userHttp.interceptors.request.use((config) => {
//   const isPublic = PUBLIC_ROUTES.some((route) => config.url.includes(route));

//   if (!isPublic) {
//     const token = localStorage.getItem("access");
//     console.log("Sending token to USER SERVICE:", token);

//     if (token && token !== "undefined" && token !== "null") {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });

// // RESPONSE INTERCEPTOR
// userHttp.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.error("UserService -> 401 Unauthorized", error);
//     }
//     return Promise.reject(error);
//   }
// );

// export default userHttp;



// src/services/userHttp.js
import axios from "axios";

const userHttp = axios.create({
  baseURL: "http://localhost:8001",
});

userHttp.interceptors.request.use((config) => {
  // Try multiple common token keys
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log("Sending token to USER SERVICE"); // Optional: reduce noise
  } else {
    console.warn("No auth token found in localStorage (checked 'access', 'access_token', 'token')");
  }

  return config;
});

// RESPONSE INTERCEPTOR
userHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // typical error logging
      console.error(`UserService Error: ${error.response.status} ${error.response.statusText}`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default userHttp;
