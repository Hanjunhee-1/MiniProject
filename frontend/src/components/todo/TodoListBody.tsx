type TodoListBodyProps = {
    children?: React.ReactNode;
};

export default function TodoListBody({ children }: TodoListBodyProps) {
    return (
        /* 모바일에서는 block으로 풀어서 내부 Row(카드)들이 줄바꿈되며 쌓이게 하고,
           PC에서는 원래 tbody의 성질(table-row-group)로 작동하도록 구현. */
        <tbody className="block md:table-row-group text-sm text-slate-800 font-medium">
            {children}
        </tbody>
    );
}