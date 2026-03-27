"use client";
 
export default function ButtonLoader({ text = "Processing..." }) {
    return (
        <span className="flex items-center justify-center gap-2">
            {/* Spinner */}
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
 
            {/* Text */}
            <span>{text}</span>
        </span>
    );
}
 