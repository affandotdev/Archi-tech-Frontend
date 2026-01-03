import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const DailyReportChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center h-80">
                <p className="text-slate-400">No report data available yet.</p>
            </div>
        );
    }

    // Format date for X-axis
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    })).reverse(); // Reverse so oldest is left, newest is right

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">Growth Metrics</h3>
                <p className="text-sm text-slate-500">Daily tracking of users, projects, and requests</p>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={formattedData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="total_users"
                            name="Total Users"
                            stroke="#6366f1"
                            fillOpacity={1}
                            fill="url(#colorUsers)"
                        />
                        <Area
                            type="monotone"
                            dataKey="total_projects"
                            name="Active Projects"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorProjects)"
                        />
                        <Area
                            type="monotone"
                            dataKey="total_profession_requests"
                            name="Prof. Requests"
                            stroke="#f43f5e"
                            fillOpacity={0.1}
                            fill="#f43f5e"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DailyReportChart;
