
import adminHttp from "./adminHttp";

export const getUsers = (search = "") => {
    return adminHttp.get(`/api/admin/users/?search=${search}`);
};

export const getUserById = (userId) => {
    return adminHttp.get(`/api/admin/users/${userId}/`);
};

export const deleteUser = (userId) => {
    return adminHttp.delete(`/api/admin/users/${userId}/`);
};

export const updateUserStatus = (userId, status) => {
    return adminHttp.patch(`/api/admin/users/${userId}/status/`, { status });
};

export const updateUserRole = (userId, role) => {
    return adminHttp.post(`/api/admin/users/${userId}/role/`, { role });
};

export const verifyUser = (userId) => {
    return adminHttp.post(`/api/admin/users/${userId}/verify/`);
};

export const getDashboardStats = () => {
    return adminHttp.get(`/api/admin/dashboard/stats/`);
};

export const getSystemHealth = () => {
    return adminHttp.get(`/api/admin/dashboard/health/`);
};
