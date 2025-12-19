import React from "react";
import Card from "../../shared/components/Card";

const RecentActivities = ({ activities = [] }) => {
    return (
        <Card title="Recent Activity" className="h-full">
            <div className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No recent activity.</p>
                ) : (
                    activities.map((activity, index) => (
                        <div key={index} className="flex relative">
                            {/* Timeline Connector */}
                            {index !== activities.length - 1 && (
                                <div className="absolute top-8 left-5 w-0.5 h-full bg-slate-100 -z-10"></div>
                            )}

                            <div className="flex-shrink-0 mr-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100">
                                    {activity.icon || (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 pt-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-semibold text-slate-800">{activity.title}</h4>
                                    <span className="text-xs text-slate-400 font-medium">{activity.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default RecentActivities;
