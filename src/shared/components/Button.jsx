import React from "react";
import Spinner from "./Spinner"; // Assuming Spinner is in the same directory

const Button = ({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    className = "",
    type = "button",
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-md shadow-indigo-500/30",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-indigo-500",
        danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 shadow-md shadow-rose-500/30",
        ghost: "text-indigo-600 bg-transparent hover:bg-indigo-50 focus:ring-indigo-500",
        outline: "border-2 border-indigo-600 text-indigo-600 bg-transparent hover:bg-indigo-50 focus:ring-indigo-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <span className="mr-2">
                    <Spinner size="sm" color={variant === "secondary" || variant === "ghost" ? "primary" : "white"} />
                </span>
            )}
            {children}
        </button>
    );
};

export default Button;
