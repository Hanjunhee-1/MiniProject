import BaseButton from "./BaseButton";

type OkButtonProps = {
    onClick?: () => void;
    className?: string;
    text?: string;
    size?: "sm" | "md" | "lg";
};

export default function OkButton({ onClick, className, text = "확인", size = "md" }: OkButtonProps) {
    return (
        <BaseButton 
            onClick={onClick} 
            className={`
                bg-emerald-500 
                hover:bg-emerald-600 
                text-white 
                border-emerald-600 
                shadow-sm 
                hover:shadow 
                font-medium
                ${className ?? ""}
            `}
            size={size}
        >
            {text}
        </BaseButton>
    )
}
