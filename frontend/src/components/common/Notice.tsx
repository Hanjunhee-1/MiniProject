type NoticeProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function Notice({ children, className }: NoticeProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}