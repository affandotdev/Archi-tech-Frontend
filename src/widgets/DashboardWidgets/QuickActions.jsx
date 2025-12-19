import React from "react";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";

const QuickActions = ({ actions = [], title = "Quick Actions" }) => {
    return (
        <Card title={title}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant="secondary"
                        className="flex flex-col items-center justify-center py-6 h-auto hover:border-indigo-200 hover:bg-indigo-50/50 group"
                        onClick={action.onClick}
                    >
                        <div className="p-3 rounded-full bg-slate-50 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 ring-1 ring-slate-200 group-hover:ring-indigo-200 transition-all duration-300 mb-3">
                            {action.icon}
                        </div>
                        <span className="text-slate-700 font-medium group-hover:text-indigo-700">{action.label}</span>
                    </Button>
                ))}
            </div>
        </Card>
    );
};

export default QuickActions;
