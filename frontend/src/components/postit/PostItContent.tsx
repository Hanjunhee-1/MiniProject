type PostItContentProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function PostItContent({ children, className }: PostItContentProps) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}