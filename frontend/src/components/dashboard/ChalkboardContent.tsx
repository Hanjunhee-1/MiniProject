type ChalkboardContentProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function ChalkboardContent({ children, className }: ChalkboardContentProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}