import BaseButton from "./BaseButton";

type FilterButtonProps = {
    text: string;
    variant?: "default" | "active";
    onClick?: () => void;
    className?: string;
};

export default function FilterButton({ text, onClick, variant = "default", className = "" }: FilterButtonProps) {
    return (
        // w-fit 대신 외부에서 w-full 등을 넘겨받아 유연하게 대처할 수 있도록 처리
        <BaseButton onClick={onClick} className={`w-full py-3 mb-2 font-bold text-xs shadow-md uppercase ${className}`} variant={variant}>
            {text}
        </BaseButton>
    )
}