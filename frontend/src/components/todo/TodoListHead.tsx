type TodoListHeadProps = {};

export default function TodoListHead() {
    return (
        /*
          - 모바일(기본값): hidden으로 지정하여 눈에 보이지도 않고 공간을 차지하지도 않게 구현.
          - md 이상(PC): md:table-header-group을 주어 기존 테이블 헤더의 고유 성질과 디자인을 원상 복구.
        */
        <thead className="hidden md:table-header-group">
            <tr className="bg-slate-800/5 border-b border-slate-300 font-bold text-sm text-slate-700 text-center">
                <th className="p-3 w-[8%]">완료</th>
                <th className="p-3 text-left w-[37%]">할 일</th>
                <th className="p-3 w-[10%]">경과일</th>
                <th className="p-3 w-[12%]">생성일</th>
                <th className="p-3 w-[10%]">소요기간</th>
                <th className="p-3 w-[13%]">마감기한</th>
                <th className="p-3 w-[10%]">관리</th>
            </tr>
        </thead>
    )
}