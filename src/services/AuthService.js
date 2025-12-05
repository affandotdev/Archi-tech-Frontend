import http from "./http";

export const registerUser = (data) => {
  return http.post("api/auth/register/", data);
};

export const loginUser = (data) => {
  return http.post("api/auth/login/", data);
};

export const verifyOtp = (data) => {
  return http.post("api/auth/verify-otp/", data);
};

export const forgotPassword = (data) => {
  return http.post("api/auth/forgot-password/", data);
};

export const resetPassword = (data) => {
  return http.post("api/auth/reset-password/", data);
};

export const logoutUser = (refreshToken) => {
  return http.post("api/auth/logout/", { refresh: refreshToken });
};

// MFA
export const setupMFA = () => {
  return http.post("api/auth/mfa/setup/");
};

export const verifyMFA = (data) => {
  return http.post("api/auth/mfa/verify/", data);
};
