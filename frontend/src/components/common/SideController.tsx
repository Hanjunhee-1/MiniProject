type SideControllerProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function SideController({ children, className }: SideControllerProps) {
    return (
        <div
            className={
                className
                    ? className
                    : `w-1/4 h-full flex flex-col items-center justify-between border-l border-green-700/50 pl-4`
            }
        >
            {children}
        </div>
    );
}