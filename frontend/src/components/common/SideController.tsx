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
                    : `w-full md:w-1/4 h-auto md:h-full flex flex-row md:flex-col items-center justify-between border-t md:border-t-0 md:border-l border-green-700/50 pt-4 md:pt-0 md:pl-4 gap-4 md:gap-0`
            }
        >
            {children}
        </div>
    );
}