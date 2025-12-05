// src/services/auth.js
import http from "./http";

// REGISTER
export const registerUser = (data) => http.post("register/", data);

// LOGIN  ✅ FIXED
export const loginUser = (data) => http.post("login/", data);

// OTP
export const verifyOtp = (data) => http.post("verify-otp/", data);

// FORGOT & RESET
export const forgotPassword = (data) => http.post("forgot-password/", data);
export const resetPassword = (data) => http.post("reset-password/", data);

// LOGOUT
export const logoutUser = (refresh) => http.post("logout/", { refresh });

// MFA
export const setupMFA = () => http.post("mfa/setup/");
export const verifyMFA = (data) => http.post("mfa/verify/", data);
