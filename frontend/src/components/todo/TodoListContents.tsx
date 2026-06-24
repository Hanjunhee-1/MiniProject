type TodoListContentsProps = {
    children?: React.ReactNode;
};

export default function TodoListContents({ children }: TodoListContentsProps) {
    return (
        <table className="w-full text-left border-collapse table-fixed">
            {children}
        </table>
    );
}