import { ForwardedRef } from "react";

type ChalkboardFrameProps = {
    ref?: ForwardedRef<HTMLDivElement>;
    children: React.ReactNode;
    className?: string;
}

export default function ChalkboardFrame({ children, className, ref }: ChalkboardFrameProps) {
    return (
        <div
            ref={ref}
            className={`w-full max-w-6xl h-auto md:h-[80vh] bg-[#234733] border-4 md:border-8 border-amber-900 rounded-lg shadow-2xl flex flex-col justify-between p-4 md:p-8 relative ${className ?? ""}`}
        >
            {children}
        </div>
    )
}