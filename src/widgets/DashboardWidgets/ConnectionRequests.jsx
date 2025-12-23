import React, { useEffect, useState } from "react";
import FollowService from "../../features/follow/api/follow.api";
import Card from "../../shared/components/Card";

export default function ConnectionRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await FollowService.getPendingRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load connection requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, action) => {
        try {
            await FollowService.respondToRequest(requestId, action);
            // Remove from list locally
            setRequests((prev) => prev.filter((req) => req.id !== requestId));
        } catch (error) {
            console.error("Failed to respond to request", error);
            alert("Action failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <Card title="Connection Requests">
                <div className="animate-pulse space-y-3">
                    <div className="h-10 bg-slate-100 rounded"></div>
                    <div className="h-10 bg-slate-100 rounded"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Connection Requests" className="h-full">
            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    <p className="text-sm">No pending requests</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {requests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                    {req.requester_name ? req.requester_name.charAt(0) : "U"}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800">{req.requester_name || "Unknown Client"}</h4>
                                    <p className="text-xs text-slate-500">wants to connect</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction(req.id, "approve")}
                                    className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors"
                                    title="Approve"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, "reject")}
                                    className="p-1.5 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition-colors"
                                    title="Reject"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
