
import authHttp from "./authHttp";

export const getUsers = (search = "") => {
    return authHttp.get(`/api/auth/admin/users/?search=${search}`);
};

export const getUserById = (userId) => {
    return authHttp.get(`/api/auth/admin/users/${userId}/`);
};

export const deleteUser = (userId) => {
    return authHttp.delete(`/api/auth/admin/users/${userId}/`);
};

export const updateUserStatus = (userId, status) => {
    return authHttp.patch(`/api/auth/admin/users/${userId}/status/`, { status });
};

export const updateUserRole = (userId, role) => {
    return authHttp.post(`/api/auth/admin/users/${userId}/role/`, { role });
};

export const verifyUser = (userId) => {
    return authHttp.post(`/api/auth/admin/users/${userId}/verify/`);
};

export const getDashboardStats = () => {
    return authHttp.get(`/api/auth/admin/dashboard/stats/`);
};

export const getSystemHealth = () => {
    // Health often doesn't need auth, but if it does, use authHttp
    return authHttp.get(`/api/auth/admin/dashboard/health/`);
};
