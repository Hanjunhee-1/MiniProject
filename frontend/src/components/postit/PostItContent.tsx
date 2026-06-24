type PostItContentProps = {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export default function PostItContent({ children, className, style }: PostItContentProps) {
    return (
        <div className={className} style={style}>
            {children}
        </div>
    )
}