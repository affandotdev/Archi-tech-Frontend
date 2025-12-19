import React from "react";
import Card from "../../shared/components/Card";

const StatsCard = ({ title, value, icon, trend, trendValue, color = "indigo" }) => {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        rose: "bg-rose-50 text-rose-600",
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">{title}</h3>
                <div className={`p-2.5 rounded-lg ${colors[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <span className="text-3xl font-bold text-slate-800 tracking-tight">{value}</span>
                </div>
                {(trend) && (
                    <div className={`flex items-center text-sm font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'} bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100`}>
                        {trend === 'up' ? (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        ) : (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                        )}
                        {trendValue}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatsCard;
