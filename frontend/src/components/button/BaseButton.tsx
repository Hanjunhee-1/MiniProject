type BaseButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "default" | "active";
    size?: "sm" | "md" | "lg";
};

const VARIANT_CLASSES = {
    default: "bg-white",
    active: "bg-yellow-200 border-yellow-400"
} as const;

const SIZE_CLASSES = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-5 text-base",
    lg: "h-12 px-6 text-lg"
} as const;

export default function BaseButton({
    children,
    onClick,
    className,
    variant = "default",
    size = "md"
}: BaseButtonProps) {
    return (
        <button onClick={onClick} className={`
            rounded-full
            border
            transition-all
            duration-200
            ${VARIANT_CLASSES[variant]}
            ${SIZE_CLASSES[size]}
            ${className ?? ""}
        `}>
            {children}
        </button>
    )
}