type ChalkboardContentProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function ChalkboardContent({ children, className }: ChalkboardContentProps) {
    return (
        <div className={
            className
                ? className
                : `h-auto md:h-[85%] w-full flex flex-col md:flex-row gap-6 my-4` 
        }>
            {children}
        </div>
    );
}