import React from "react";

const Input = ({
    label,
    error,
    id,
    type = "text",
    className = "",
    containerClassName = "",
    ...props
}) => {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all duration-200 
          ${error
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50"
                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 bg-white"
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-rose-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
