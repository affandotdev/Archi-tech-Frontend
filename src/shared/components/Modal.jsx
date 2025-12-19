import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, footer, size = "md" }) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const maxWidths = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-full mx-4",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidths[size]} transform transition-all animate-in zoom-in-95 duration-200`}
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
                {footer && (
                    <div className="flex items-center justify-end p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
