type BasePostItProps = {
    children: React.ReactNode;
    colorClass?: string;
    className?: string;
    onClick?: () => void;
    onTouchStart?: () => void;
}

export default function BasePostIt({
    children,
    colorClass = "bg-yellow-100 border-yellow-200 text-yellow-900",
    className = "",
    onClick,
    onTouchStart
}: BasePostItProps) {
    return (
        <div
            onClick={onClick}
            onTouchStart={onTouchStart}
            className={`
            relative 
            w-80 
            h-80 
            p-6 
            shadow-md 
            transition-all 
            duration-300
            ${onClick ? "cursor-pointer" : ""}
            ${colorClass}
            ${className}
        `}
        >
            {children}
        </div>
    );
}