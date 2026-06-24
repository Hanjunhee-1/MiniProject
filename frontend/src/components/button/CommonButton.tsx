import BaseButton from "./BaseButton";

type CommonButtonProps = {
    onClick: () => void;
    text?: string;
    className?: string;
}

export default function CommonButton({ onClick, text, className }: CommonButtonProps) {
    return (
        <BaseButton
            onClick={onClick}
            variant="default"
            size="sm"
            className={className}
        >
            {text}
        </BaseButton>
    );
}