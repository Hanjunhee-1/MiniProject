type TodoListHeadProps = {

};

export default function TodoListHead() {
    return (
        <thead>
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