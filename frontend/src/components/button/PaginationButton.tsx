import BaseButton from "./BaseButton";

type PaginationButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
    className?: string;
};

export default function PaginationButton({
    children,
    onClick,
    active = false,
    disabled = false,
    className
}: PaginationButtonProps) {
    return (
        <BaseButton
            onClick={disabled ? undefined : onClick}
            variant={active ? "active" : "default"}
            className={`
                flex items-center justify-center 
                min-w-[2.5rem] h-10 px-3
                rounded-md
                ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:scale-105"}
                ${active ? "bg-amber-300 border-amber-500 text-amber-950 font-bold" : "bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-700 hover:text-white"}
                transition-all duration-200
                shadow-sm
                ${className ?? ""}
            `}
        >
            {children}
        </BaseButton>
    )
}
