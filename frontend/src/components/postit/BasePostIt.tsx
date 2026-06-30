type BasePostItProps = {
    children: React.ReactNode;
    colorClass?: string;
    className?: string;
    variant?: "login" | "dashboard";
    onClick?: () => void;
    onTouchStart?: () => void;
}

const VARIANT_SIZE_CLASSES = {
    login: "w-80 h-80 p-6",
    dashboard: "w-full h-full min-h-[10rem] md:min-h-0 aspect-[4/5] md:aspect-auto p-3 md:p-4",
} as const;

export default function BasePostIt({
    children,
    colorClass = "bg-yellow-100 border-yellow-200 text-yellow-900",
    className = "",
    variant = "login",
    onClick,
    onTouchStart
}: BasePostItProps) {
    return (
        <div
            onClick={onClick}
            onTouchStart={onTouchStart}
            className={`
            relative 
            shadow-md 
            transition-all 
            duration-300
            ${onClick ? "cursor-pointer" : ""}
            ${colorClass}
            ${VARIANT_SIZE_CLASSES[variant]}
            ${className}
        `}
        >
            {children}
        </div>
    );
}