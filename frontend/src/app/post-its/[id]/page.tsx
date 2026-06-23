"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTodosByPostItId, createTodo, deleteTodo, completeTodo } from "@/api/postIts";
import { Todo } from "@/types";
import { getMe } from "@/api/auth";
import CommonButton from "@/components/button/CommonButton";
import Title from "@/components/common/Title";
import DeleteButton from "@/components/button/DeleteButton";
import ChalkboardFrame from "@/components/dashboard/ChalkboardFrame";
import PostItContent from "@/components/postit/PostItContent";

export default function PostItDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const postId = params.id as string;
    const postColor = searchParams.get("color") || "bg-[#FFFDEE]";

    // 쿼리 파라미터에서 소유자 ID 추출
    const postOwnerId = searchParams.get("ownerId") ? Number(searchParams.get("ownerId")) : null;

    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 현재 로그인한 유저 상태 관리
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // 새로운 TODO 입력을 위한 상태들
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [newContent, setNewContent] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");

    // 최초 진입 시 로컬스토리지에서 유저 고유 ID 식별
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            try {
                const data = await getMe(token);
                if (data.success && data.user) {
                    setCurrentUserId(data.user.id);
                }
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    // 소유 권한 체크 검증식
    const isOwner = currentUserId !== null && postOwnerId !== null && currentUserId === postOwnerId;

    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // 1. 초기 TODO 리스트 조회
    const fetchPostItTodos = async () => {
        const token = localStorage.getItem("accessToken") || "";
        if (!token || !postId) return;

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

    useEffect(() => {
        fetchPostItTodos();
    }, [postId]);

    // 2. TODO 생성 처리 (POST)
    const handleCreateTodo = async (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault();
        if (!newContent.trim()) return;

        // 권한 클라이언트 2차 방어
        if (!isOwner) {
            alert("본인의 포스트잇에만 할 일을 생성할 수 있습니다.");
            return;
        }

        const token = localStorage.getItem("accessToken") || "";
        if (!token) return;

        try {
            const body = {
                content: newContent.trim(),
                due_date: dueDate ? `${dueDate} 00:00:00` : null,
            };

            const data = await createTodo(token, { postId: Number(postId) }, body);
            if (data.success) {
                const newTodo = (data as any).todo || data.todos;
                if (newTodo) {
                    setTodos((prev) => [...prev, newTodo]);
                } else {
                    fetchPostItTodos();
                }
                setNewContent("");
                setDueDate("");
                setIsCreating(false);
            } else {
                alert("TODO를 생성하지 못했습니다.");
            }
        } catch (error) {
            console.error("TODO 생성 중 오류 발생:", error);
        }
    };

    // 3. TODO 완료 토글 처리 (PATCH)
    const handleToggleComplete = async (todoId: number, currentStatus: boolean) => {
        if (currentStatus) return;

        // 타인 포스트잇 완료 수정 방어
        if (!isOwner) return;

        const token = localStorage.getItem("accessToken") || "";
        if (!token) return;

        try {
            const data = await completeTodo(token, { postId: Number(postId), todoId });
            if (data.success) {
                const updatedTodo = (data as any).todo || data.todos;
                if (updatedTodo && !Array.isArray(updatedTodo)) {
                    setTodos((prev) =>
                        prev.map((t) => (t.id === todoId ? updatedTodo : t))
                    );
                } else {
                    fetchPostItTodos();
                }
            }
        } catch (error) {
            console.error("TODO 완료 처리 중 오류 발생:", error);
        }
    };

    // 4. TODO 삭제 처리 (DELETE)
    const handleDeleteTodo = async (todoId: number) => {
        // 타인 포스트잇 삭제 방어
        if (!isOwner) return;
        if (!confirm("이 할 일 항목을 삭제하시겠습니까?")) return;

        const token = localStorage.getItem("accessToken") || "";
        if (!token) return;

        try {
            const data = await deleteTodo(token, { postId: Number(postId), todoId });
            if (data.success) {
                setTodos((prev) => prev.filter((t) => t.id !== todoId));
            } else {
                alert("TODO를 삭제하지 못했습니다.");
            }
        } catch (error) {
            console.error("TODO 삭제 중 오류 발생:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleCreateTodo();
        }
    };

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-6 select-none">
            {/* 뒤로가기 */}
            <CommonButton
                onClick={() => router.push("/")}
                text="← 칠판 대시보드로 돌아가기"
                className="absolute top-4 left-4 bg-white/80 hover:bg-white text-xs px-3 py-1.5 rounded-md shadow-sm text-slate-700 font-medium"
            />

            {/* 칠판 전체 프레임 */}
            <ChalkboardFrame>
                <PostItContent className={`w-full h-full rounded-md shadow-inner p-8 flex flex-col justify-between ${postColor}`}>

                    {/* 상단: 타이틀 구역 */}
                    <Title
                        className="flex justify-between items-end border-b border-slate-300/60 pb-3"
                        text="📌 Task Board">
                        <p className="text-xs text-slate-500 mt-1">포스트잇 고유 식별코드: No.{postId}</p>
                    </Title>

                    {/* 테이블 영역 */}
                    <div className="flex-1 overflow-y-auto bg-white/40 rounded border border-slate-200/60 my-5">
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold animate-pulse">
                                할 일 목록 리스트를 불러오고 있습니다...
                            </div>
                        ) : todos.length > 0 || isCreating ? (
                            <table className="w-full text-left border-collapse table-fixed">
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
                                                        // 완료되었거나 본인 소유가 아니라면 체크박스 비활성화
                                                        disabled={isCompleted || !isOwner}
                                                        onChange={() => handleToggleComplete(todo.id, isCompleted)}
                                                        className="w-4 h-4 accent-green-700 cursor-pointer disabled:cursor-not-allowed"
                                                    />
                                                </td>
                                                <td className="p-3 text-left font-bold tracking-tight relative group/content whitespace-pre-wrap break-all">
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
                                                    {todo.elapsed_date !== null ? `${todo.elapsed_date}일` : "—"}
                                                </td>
                                                <td className="p-3 text-slate-600 font-mono text-xs">
                                                    {todo.created_at ? new Date(todo.created_at).toLocaleDateString() : "—"}
                                                </td>
                                                <td className="p-3 text-slate-600 font-mono text-xs">
                                                    {todo.duration != null ? `${todo.duration}일` : "—"}
                                                </td>
                                                <td className="p-3 text-slate-600 font-mono text-xs">
                                                    {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "—"}
                                                </td>
                                                <td className="p-3">
                                                    {/* 본인 소유인 경우에만 삭제 버튼을 노출 */}
                                                    {isOwner && (
                                                        <DeleteButton
                                                            onClick={() => handleDeleteTodo(todo.id)}
                                                            className="w-4 h-4 text-red-500 hover:text-red-700 font-bold transition-colors text-base">
                                                            ❌
                                                        </DeleteButton>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* ➕ 인라인 TODO 생성 로우 추가 구역 */}
                                    {isCreating && isOwner && (
                                        <tr className="bg-white/60 border-b border-green-200 text-center animate-in fade-in slide-in-from-top-1 duration-200">
                                            <td className="p-3">
                                                <input type="checkbox" disabled className="w-4 h-4 opacity-40" />
                                            </td>
                                            <td className="p-2 text-left">
                                                <textarea
                                                    placeholder="새로운 할 일을 입력하세요... (Enter: 저장, Shift+Enter: 줄바꿈)"
                                                    value={newContent}
                                                    onChange={(e) => setNewContent(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    rows={2}
                                                    className="w-full bg-white/90 border border-slate-300 rounded px-2 py-1 text-xs font-bold outline-none focus:border-slate-500 resize-none"
                                                    autoFocus
                                                />
                                            </td>
                                            <td className="p-3 text-slate-400 text-xs font-mono">—</td>
                                            <td className="p-3 text-slate-400 text-xs font-mono">Today</td>
                                            <td className="p-3 text-slate-400 text-xs font-mono">—</td>
                                            <td className="p-2">
                                                <input
                                                    type="date"
                                                    value={dueDate}
                                                    min={getTodayString()}
                                                    onChange={(e) => setDueDate(e.target.value)}
                                                    className="w-full bg-white/90 border border-slate-300 rounded p-1 text-[11px] font-mono outline-none"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                                                    <button onClick={() => handleCreateTodo()} className="text-green-600 hover:text-green-800 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-200 shadow-sm w-full sm:w-auto">
                                                        확인
                                                    </button>
                                                    <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-slate-700 text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200 shadow-sm w-full sm:w-auto">
                                                        취소
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
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
                        {/* 본인 소유일 때만 생성 단추 노출 */}
                        {!isCreating && isOwner && (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="bg-slate-800 text-white hover:bg-slate-900 px-4 py-2 rounded font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                            >
                                <span>➕</span> TODO 생성하기
                            </button>
                        )}
                    </div>
                </PostItContent>
            </ChalkboardFrame>
        </main>
    );
}