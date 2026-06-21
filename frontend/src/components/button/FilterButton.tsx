import BaseButton from "./BaseButton";

type FilterButtonProps = {
    text: string;
    variant?: "default" | "active";
    onClick?: () => void;
};

export default function FilterButton({ text, onClick, variant = "default" }: FilterButtonProps) {
    return (
        <BaseButton onClick={onClick} className="w-fit" variant={variant}>
            {text}
        </BaseButton>
    )
}