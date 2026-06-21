// src/components/button/PaginationButton.tsx
import BaseButton from "./BaseButton";

type PaginationButtonProps = {
    direction: "up" | "down";
    onClick: () => void;
    disabled?: boolean;
};

export default function PaginationButton({
    direction,
    onClick,
    disabled = false,
}: PaginationButtonProps) {
    // 방향에 따른 화살표 텍스트 또는 모양
    const arrow = direction === "up" ? "▲" : "▼";

    return (
        <BaseButton
            onClick={onClick}
            disabled={disabled}
            variant={disabled ? "default" : "active"}
            size="lg"
            // 수직 버튼 느낌을 주기 위해 w-16 h-16 정도로 둥글고 큼직하게 설정합니다.
            className="w-16 h-16 shadow-md border-2 font-bold text-xl flex flex-col items-center justify-center"
        >
            <span>{arrow}</span>
            <span className="text-[10px] uppercase tracking-wider block -mt-1">
                {direction === "up" ? "Prev" : "Next"}
            </span>
        </BaseButton>
    );
}