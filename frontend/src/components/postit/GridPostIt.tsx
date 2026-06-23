type GridPostItProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function GridPostIt({ children, className }: GridPostItProps) {
    return (
        <div className={
            className
                ? className
                : `w-3/4 h-full grid grid-cols-4 grid-rows-2 gap-4 border border-dashed border-green-800/40 rounded-md p-4 items-center justify-items-center bg-black/5`}>
            {children}
        </div>
    )
}