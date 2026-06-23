import { Attributes } from "react";

type TodoRowProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function TodoRow({ children, className }: TodoRowProps) {
    return (
        <tr
            className={
                className
                    ? className
                    : `border-b border-slate-200 hover:bg-white/40 text-center transition-colors group/row relative`
            }
        >
            {children}
        </tr>
    );
}