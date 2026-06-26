import { ChangeEvent } from "react";

type DatePickerProps = {
    value?: string;
    min?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

export default function DatePicker({
    value,
    min,
    onChange,
    className,
}: DatePickerProps) {
    return (
        <input
            type="date"
            value={value}
            min={min}
            onChange={onChange}
            className={
                className
                    ? className
                    : `w-full bg-white/90 border border-slate-300 rounded p-1 text-[11px] font-mono outline-none`
            }
        />
    )
}