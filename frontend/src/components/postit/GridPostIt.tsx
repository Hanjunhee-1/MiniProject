type GridPostItProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function GridPostIt({ children, className }: GridPostItProps) {
    return (
        <div className={
            className
                ? className
                : `w-full md:w-3/4 h-auto md:h-full flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-4 md:grid-rows-1 gap-3 md:gap-4 border border-dashed border-green-800/40 rounded-md p-2 md:p-4 items-stretch justify-items-center bg-black/5 scrollbar-hide`
        }>
            {children}
        </div>
    )
}