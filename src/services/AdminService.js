
import userHttp from "./userHttp";

export const getUsers = (search = "") => {
    return userHttp.get(`/api/admin/users/?search=${search}`);
};

export const getUserById = (userId) => {
    return userHttp.get(`/api/admin/users/${userId}/`);
};

export const deleteUser = (userId) => {
    return userHttp.delete(`/api/admin/users/${userId}/`);
};

export const updateUserStatus = (userId, status) => {
    return userHttp.patch(`/api/admin/users/${userId}/status/`, { status });
};

export const updateUserRole = (userId, role) => {
    return userHttp.post(`/api/admin/users/${userId}/role/`, { role });
};

export const verifyUser = (userId) => {
    return userHttp.post(`/api/admin/users/${userId}/verify/`);
};

export const getDashboardStats = () => {
    return userHttp.get(`/api/admin/dashboard/stats/`);
};

export const getSystemHealth = () => {
    return userHttp.get(`/api/admin/dashboard/health/`);
};
