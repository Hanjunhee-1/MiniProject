import BaseButton from "./BaseButton";

type LogoutButtonProps = {
    onClick: () => void;
    text?: string;
    className?: string;
}

export default function LogoutButton({ onClick, text, className }: LogoutButtonProps) {
    return (
        <BaseButton
            onClick={onClick}
            variant="default"
            size="sm"
            className={className}
        >
            {text || "← 로그아웃"}
        </BaseButton>
    );
}