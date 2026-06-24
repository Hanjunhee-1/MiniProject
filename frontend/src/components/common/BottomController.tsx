type BottomControllerProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function BottomController({ children, className }: BottomControllerProps) {
    return (
        <div className={
            className
                ? className
                : "flex justify-between items-center border-t border-slate-200/60 pt-3"
        }>
            {children}
        </div>
    );
}