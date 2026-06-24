type PaginationFrameProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function PaginationFrame({ children, className }: PaginationFrameProps) {
    return (
        <div className="flex flex-col items-center gap-6 mt-4">
            {children}
        </div>
    )
}