"use client";
 
import ButtonLoader from "./ButtonLoader";
 
interface Props {
    text: string;
    loading?: boolean;
    onClick?: (e?: any) => void;
    type?: "button" | "submit";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
}
 
export default function AppButton({
    text,
    loading = false,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    fullWidth = true,
}: Props) {
    const base =
        "py-3.5 font-semibold rounded-[30px] transition-all flex items-center justify-center cursor-pointer";
 
    const width = fullWidth ? "w-full" : "";
 
    const variants = {
        primary:
            "bg-[#1C3C5F] text-white shadow-[0_4px_14px_rgba(28,60,95,0.2)] hover:bg-[#264d78]",
        secondary:
            "border border-[#1C3C5F] text-[#1C3C5F] hover:bg-[#1C3C5F] hover:text-white",
        danger:
            "bg-[#D43F33] text-white shadow-[0_4px_14px_rgba(212,63,51,0.3)] hover:bg-[#b8352b]",
    };
 
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`${base} ${width} ${variants[variant]} ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
                }`}
        >
            {loading ? <ButtonLoader text={text} /> : text}
        </button>
    );
}
 