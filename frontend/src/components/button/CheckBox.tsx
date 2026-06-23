type CheckBoxProps = {
    checked: boolean;
    disabled: boolean;
    onChange: () => void;
    className?: string;
};

export default function CheckBox({ checked, disabled, onChange, className }: CheckBoxProps) {
    return (
        <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className={
                className
                    ? className
                    : `w-4 h-4 accent-green-700 cursor-pointer disabled:cursor-not-allowed`
            }
        />
    )
}