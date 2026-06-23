"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation"; // 💡 useSearchParams 추가
import { useEffect, useState } from "react";
import { getTodosByPostItId } from "@/api/postIts";
import { Todo } from "@/types";

export default function PostItDetailPage() {
    /**
     * 할 일
     * 1. API 연결
     * 2. 컴포넌트 재사용 가능한 것은 재사용
     * 3. UI 좀 더 좋게 만들기
     * 4. 완료된 할일에 hovering 시에 완료날짜 표시해주기
     */
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams(); // 💡 쿼리 파라미터 파싱용 훅

    const postId = params.id as string;
    // 💡 URL에서 color 인자를 읽어오고, 없을 경우 크림색 기본값으로 디폴트 처리합니다.
    const postColor = searchParams.get("color") || "bg-[#FFFDEE]";

    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken") || "";
        if (!token || !postId) return;

        const fetchPostItTodos = async () => {
            setIsLoading(true);
            try {
                const data = await getTodosByPostItId(token, { postId: Number(postId) });
                if (data.success) {
                    setTodos(data.todos || []);
                } else {
                    console.error("할 일 목록을 불러오지 못했습니다.");
                }
            } catch (error) {
                console.error("상세 페이지 API 통신 오류:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPostItTodos();
    }, [postId]);

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-6 select-none">
            {/* 뒤로가기 */}
            <button
                onClick={() => router.push("/")}
                className="absolute top-4 left-4 bg-white/80 hover:bg-white text-xs px-3 py-1.5 rounded-md shadow-sm text-slate-700 font-medium transition-colors"
            >
                ← 칠판 대시보드로 돌아가기
            </button>

            {/* 칠판 전체 프레임 */}
            <div className="w-full max-w-6xl h-[80vh] bg-[#234733] border-8 border-amber-900 rounded-lg shadow-2xl p-8 relative">

                <div className={`w-full h-full rounded-md shadow-inner p-8 flex flex-col justify-between ${postColor}`}>

                    {/* 상단: 타이틀 구역 */}
                    <div className="flex justify-between items-end border-b border-slate-300/60 pb-3">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-wide">
                                📌 Task Board
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">포스트잇 고유 식별코드: No.{postId}</p>
                        </div>
                    </div>

                    {/* 테이블 영역 */}
                    <div className="flex-1 overflow-y-auto bg-white/40 rounded border border-slate-200/60 my-5">
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold animate-pulse">
                                할 일 목록 리스트를 불러오고 있습니다...
                            </div>
                        ) : todos.length > 0 ? (
                            <table className="w-full text-left border-collapse table-fixed">
                                <thead>
                                    <tr className="bg-slate-800/5 border-b border-slate-300 font-bold text-sm text-slate-700 text-center">
                                        <th className="p-3 w-[10%]">완료</th>
                                        <th className="p-3 text-left w-[40%]">할 일</th>
                                        <th className="p-3 w-[12%]">경과일</th>
                                        <th className="p-3 w-[13%]">생성일</th>
                                        <th className="p-3 w-[10%]">소요기간</th>
                                        <th className="p-3 w-[10%]">마감기한</th>
                                        <th className="p-3 w-[5%]">삭제</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-800 font-medium">
                                    {todos.map((todo) => {
                                        const isCompleted = !!todo.completed_at;

                                        return (
                                            <tr
                                                key={todo.id}
                                                className="border-b border-slate-200 hover:bg-white/40 text-center transition-colors group/row relative"
                                            >
                                                <td className="p-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompleted}
                                                        readOnly
                                                        className="w-4 h-4 accent-green-700 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="p-3 text-left font-bold tracking-tight truncate relative group/content">
                                                    <span className={isCompleted ? "line-through text-slate-400" : "text-slate-800"}>
                                                        {todo.content}
                                                    </span>
                                                    {isCompleted && todo.completed_at && (
                                                        <div className="absolute left-4 -top-6 hidden group-hover/content:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-md z-30 pointer-events-none whitespace-nowrap">
                                                            완료일: {new Date(todo.completed_at).toLocaleString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3 text-slate-600 font-mono text-xs">
                                                    {todo.elapsed_date !== null ? `${todo.elapsed_date} day` : "—"}
                                                </td>
                                                <td className="p-3 text-slate-600 font-mono text-xs">
                                                    {new Date(todo.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 text-slate-600 font-mono text-xs">
                                                    {todo.duration !== null ? `${todo.duration}일` : "—"}
                                                </td>
                                                <td className="p-3 text-slate-600 font-mono text-xs">
                                                    {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "—"}
                                                </td>
                                                <td className="p-3">
                                                    <button className="text-red-500 hover:text-red-700 font-bold transition-colors text-base">
                                                        ❌
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 py-16">
                                <span className="text-3xl mb-1">🍃</span>
                                <p className="text-xs font-semibold">아직 등록된 할 일 항목이 존재하지 않습니다.</p>
                            </div>
                        )}
                    </div>

                    {/* 하단 제어 바 */}
                    <div className="flex justify-between items-center border-t border-slate-200/60 pt-3">
                        <p className="text-[11px] text-slate-600 font-medium">
                            💡 완료된 할 일 행의 글자에 마우스를 올리면 정확한 완료 일시가 표시됩니다.
                        </p>
                        <button className="bg-slate-800 text-white hover:bg-slate-900 px-4 py-2 rounded font-bold text-xs shadow transition-colors flex items-center gap-1.5">
                            <span>➕</span> TODO 생성하기
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}