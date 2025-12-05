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
  const token = localStorage.getItem("access");   // FIXED

  console.log("Sending token to USER SERVICE:", token);

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default userHttp;
