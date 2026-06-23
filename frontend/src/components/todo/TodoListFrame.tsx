type TodoListFrameProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function TodoListFrame({ children, className }: TodoListFrameProps) {
    return (
        <div className={
            className
                ? className
                : `flex-1 overflow-y-auto bg-white/40 rounded border border-slate-200/60 my-5`
        }>
            {children}
        </div>
    )
}