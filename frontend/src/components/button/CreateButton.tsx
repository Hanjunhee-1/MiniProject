import BaseButton from "./BaseButton";

type CreateButtonProps = {
    onClick: () => void;
    className?: string;
    children?: React.ReactNode
}

export default function CreateButton({ onClick, className, children }: CreateButtonProps) {
    return (
        <BaseButton
            onClick={onClick}
            className={
                className
                    ? className
                    : `bg-slate-800 text-black hover:bg-slate-900 hover:text-white px-4 py-2 rounded font-bold text-xs shadow transition-colors flex items-center gap-1.5`
            }
            size="lg"
            variant="active"
        >
            {children}
        </BaseButton>
    )
}