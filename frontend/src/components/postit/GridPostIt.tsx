type GridPostItProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function GridPostIt({ children, className }: GridPostItProps) {
    return (
        <div className={
            className
                ? className
                : `w-full md:w-3/4 h-auto md:h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 border border-dashed border-green-800/40 rounded-md p-2 md:p-4 items-center justify-items-center bg-black/5`
        }>
            {children}
        </div>
    )
}