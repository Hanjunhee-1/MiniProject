type TodoListContentsProps = {
    children?: React.ReactNode;
};

export default function TodoListContents({ children }: TodoListContentsProps) {
    return (
        /* 
          - 모바일(기본값): block 스타일로 지정하여 내부 요소들이 순서대로 세로로 쌓이게 구현.
          - md 이상(PC): 기존의 table 및 table-fixed 레이아웃으로 복귀하여 넓은 화면을 활용.
        */
        <table className="w-full block md:table text-left border-collapse md:table-fixed">
            {children}
        </table>
    );
}