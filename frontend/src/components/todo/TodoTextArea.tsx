import { ChangeEvent, KeyboardEvent } from "react";

type TodoTextAreaProps = {
    className?: string;
    rows?: number;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
    value?: string;
    placeholder?: string;
}

export default function TodoTextArea({
    className,
    rows,
    onChange,
    onKeyDown,
    value,
    placeholder
}: TodoTextAreaProps) {
    return (
        <textarea
            className={
                className
                    ? className
                    : `w-full bg-white/90 border border-slate-300 rounded px-2 py-1 text-xs font-bold outline-none focus:border-slate-500 resize-none`
            }
            rows={rows}
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={value}
            autoFocus={true}
            placeholder={placeholder || "새로운 할 일을 입력하세요... (Enter: 저장, Shift+Enter: 줄바꿈)"}
        />
    )
}