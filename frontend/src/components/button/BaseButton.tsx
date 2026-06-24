import { SIZE_CLASSES } from "@/constants/size";
import { VARIANT_CLASSES } from "@/constants/variants";

type BaseButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    variant?: "default" | "active";
    size?: "sm" | "md" | "lg";
};

export default function BaseButton({
    children,
    onClick,
    className,
    disabled = false,
    variant = "default",
    size = "md"
}: BaseButtonProps) {
    return (
        <button onClick={onClick} disabled={disabled} className={`
            inline-flex
            items-center
            justify-center
            gap-2
            cursor-pointer
            rounded-full
            border
            transition-all
            duration-200
            text-black
            hover:scale-105
            hover:shadow-lg
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${VARIANT_CLASSES[variant]}
            ${SIZE_CLASSES[size]}
            ${className ?? ""}
        `}>
            {children}
        </button>
    )
}