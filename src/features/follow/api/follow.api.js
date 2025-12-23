import userHttp from "../../../services/userHttp";

class FollowService {
    async sendConnectionRequest(targetUserId) {
        const response = await userHttp.post("/api/follow/send/", {
            target_user_id: targetUserId
        });
        return response.data;
    }

    async getPendingRequests() {
        const response = await userHttp.get("/api/follow/pending/");
        return response.data;
    }

    async respondToRequest(requestId, action) {
        // action: "approve" or "reject"
        const response = await userHttp.post("/api/follow/approve/", {
            request_id: requestId,
            action: action
        });
        return response.data;
    }

    async checkAccess(targetUserId) {
        const response = await userHttp.get(`/api/follow/check/${targetUserId}/`);
        return response.data;
    }

    async getConnections() {
        const response = await userHttp.get("/api/follow/connections/");
        return response.data;
    }
}

export default new FollowService();
