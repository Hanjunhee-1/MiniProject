import BaseButton from "./BaseButton";

type DeleteButtonProps = {
    onClick: () => void;
    className?: string;
    children?: React.ReactNode
}

export default function DeleteButton({ onClick, className, children }: DeleteButtonProps) {
    return (
        <BaseButton
            onClick={onClick}
            size="lg"
            className={className}>
            {children}
        </BaseButton>
    );
}