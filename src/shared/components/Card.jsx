import React from "react";

const Card = ({ children, title, footer, className = "", noPadding = false }) => {
    return (
        <div
            className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
        >
            {title && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                </div>
            )}
            <div className={noPadding ? "" : "p-6"}>{children}</div>
            {footer && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
