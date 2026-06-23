type ChalkboardContentProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function ChalkboardContent({ children, className }: ChalkboardContentProps) {
    return (
        <div className={
            className
                ? className
                : `h-[85%] w-full flex gap-6 my-4`
        }>
            {children}
        </div>
    );
}