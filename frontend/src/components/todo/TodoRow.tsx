type TodoRowProps = {
    children?: React.ReactNode;
    className?: string;
};

export default function TodoRow({ children, className }: TodoRowProps) {
    return (
        /*
          - 모바일(기본값): block 형태로 변경하고 카드 스타일(p-3, mb-2, bg, shadow)을 부여해 정갈하게 나열.
          - md 이상(PC): 기존의 table-row 성질로 완전 원상복귀.
        */
        <tr
            className={
                className
                    ? className
                    : `block md:table-row border-b border-slate-200 hover:bg-white/40 text-center transition-colors group/row relative p-3 md:p-0 mb-2 md:mb-0 rounded-lg md:rounded-none bg-white/30 md:bg-transparent shadow-sm md:shadow-none flex flex-row items-center justify-between md:inline-table`
            }
        >
            {children}
        </tr>
    );
}