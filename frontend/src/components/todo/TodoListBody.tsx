type TodoListBodyProps = {
    children?: React.ReactNode;
};

export default function TodoListBody({ children }: TodoListBodyProps) {
    return (
        <tbody className="text-sm text-slate-800 font-medium">
            {children}
        </tbody>
    );
}