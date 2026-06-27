"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { getTodosByPostItId, createTodo, deleteTodo, updateTodo } from "@/api/postIts";
import { Todo } from "@/types";
import { getMe } from "@/api/auth";
import CommonButton from "@/components/button/CommonButton";
import Title from "@/components/common/Title";
import DeleteButton from "@/components/button/DeleteButton";
import ChalkboardFrame from "@/components/dashboard/ChalkboardFrame";
import PostItContent from "@/components/postit/PostItContent";
import BottomController from "@/components/common/BottomController";
import CreateButton from "@/components/button/CreateButton";
import Notice from "@/components/common/Notice";
import TodoListFrame from "@/components/todo/TodoListFrame";
import TodoListHead from "@/components/todo/TodoListHead";
import TodoListContents from "@/components/todo/TodoListContents";
import TodoListBody from "@/components/todo/TodoListBody";
import TodoRow from "@/components/todo/TodoRow";
import CheckBox from "@/components/button/CheckBox";
import TodoTextArea from "@/components/todo/TodoTextArea";
import DatePicker from "@/components/common/DatePicker";
import MobileMetadata from "@/components/todo/MobileMetadata";

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

  // 모바일에서 확장 메타데이터를 보여줄 선택된 Todo ID 관리 상태
  const [expandedTodoId, setExpandedTodoId] = useState<number | null>(null);

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
    // 타인 포스트잇 완료 수정 방어
    if (!isOwner) return;

    const token = localStorage.getItem("accessToken") || "";
    if (!token) return;

    try {
      const data = await updateTodo(token, { postId: Number(postId), todoId }, { isCompleted: !currentStatus });
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
    // if (e.key === "Enter" && !e.shiftKey) {
    //   e.preventDefault();
    //   handleCreateTodo();
    // }
    if (e.key === "Enter") {
      // 모바일 or PC
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        return;
      }

      // PC 버전의 경우 Enter 입력 시 저장.
      if (!e.shiftKey) {
        e.preventDefault();
        handleCreateTodo();
      }
    }
  };

  // 모바일용 항목 클릭 토글 헬퍼 함수
  const toggleExpandTodo = (todoId: number) => {
    setExpandedTodoId((prev) => (prev === todoId ? null : todoId));
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-1 md:p-6 select-none">
      <CommonButton
        onClick={() => router.push("/")}
        text="← 칠판 대시보드로 돌아가기"
        className="relative w-full mb-4 justify-center text-center bg-white/80 hover:bg-white text-xs px-3 py-2.5 rounded-md shadow-sm text-slate-700 font-medium md:absolute md:top-4 md:left-4 md:w-auto md:mb-0 md:py-1.5"
      />

      <ChalkboardFrame>
        <PostItContent className={`w-full h-full rounded-md shadow-inner p-2 md:p-8 flex flex-col justify-between ${postColor}`}>
          <Title className="flex justify-between items-end border-b border-slate-300/60 pb-3" text="📌 Task Board">
            <p className="text-xs text-slate-500 mt-1">포스트잇 고유 식별코드: No.{postId}</p>
          </Title>

          <TodoListFrame>
            {isLoading ? (
              <Notice className="w-full h-full flex items-center justify-center text-slate-500 font-semibold animate-pulse">
                할 일 목록을 불러오고 있습니다...
              </Notice>
            ) : todos.length > 0 || isCreating ? (
              <TodoListContents>
                <TodoListHead />
                <TodoListBody>
                  {todos.map((todo) => {
                    const isCompleted = !!todo.completed_at;
                    const isExpanded = expandedTodoId === todo.id;

                    return (
                      <Fragment key={todo.id}>
                        <TodoRow>
                          {/* 1. 완료 체크박스 */}
                          <td className="p-3 md:table-cell">
                            <CheckBox
                              checked={isCompleted}
                              disabled={!isOwner}
                              onChange={() => handleToggleComplete(todo.id, isCompleted)}
                            />
                          </td>

                          {/* 2. 할 일 내용 - 클릭 시 모바일 상세창 토글 기능 연동 */}
                          <td
                            onClick={() => toggleExpandTodo(todo.id)}
                            className="p-3 text-left font-bold tracking-tight relative group/content whitespace-pre-wrap break-all flex-1 md:table-cell cursor-pointer md:cursor-default"
                          >
                            <span className={isCompleted ? "line-through text-slate-400" : "text-slate-800"}>
                              {todo.content}
                            </span>

                            {/* 데스크톱 마우스 오버 툴팁 */}
                            {isCompleted && todo.completed_at && (
                              <div className="absolute left-4 -top-6 hidden group-hover/content:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-md z-30 pointer-events-none whitespace-nowrap">
                                완료일: {new Date(todo.completed_at).toLocaleString()}
                              </div>
                            )}
                          </td>

                          {/* 데스크톱 전용 메타데이터 컬럼 */}
                          <td className="hidden md:table-cell p-3 text-slate-600 font-mono text-xs">
                            {todo.elapsed_date !== null ? `${todo.elapsed_date}일` : "—"}
                          </td>
                          <td className="hidden md:table-cell p-3 text-slate-600 font-mono text-xs">
                            {todo.created_at ? new Date(todo.created_at).toLocaleDateString() : "—"}
                          </td>
                          <td className="hidden md:table-cell p-3 text-slate-600 font-mono text-xs">
                            {todo.duration != null ? `${todo.duration}일` : "—"}
                          </td>
                          <td className="hidden md:table-cell p-3 text-slate-600 font-mono text-xs">
                            {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "—"}
                          </td>

                          {/* 3. 삭제 제어 버튼 */}
                          <td className="p-3 md:table-cell">
                            {isOwner && (
                              <DeleteButton
                                onClick={() => handleDeleteTodo(todo.id)}
                                className="w-4 h-4 text-red-500 hover:bg-red-100 font-bold text-base transform transition-all duration-300 hover:scale-125"
                              >
                                ❌
                              </DeleteButton>
                            )}
                          </td>
                        </TodoRow>

                        {/* 4. 모바일 전용 메타데이터 카드식 드롭다운 */}
                        {isExpanded && (
                          <TodoRow className="block md:hidden bg-white/40 border-b border-dashed border-slate-300">
                            <td colSpan={3} className="p-4 text-left">
                              <MobileMetadata todo={todo} isCompleted={isCompleted} />
                            </td>
                          </TodoRow>
                        )}
                      </Fragment>
                    );
                  })}

                  {/* ➕ 인라인 TODO 생성 로우 추가 구역 */}
                  {isCreating && isOwner && (
                    <TodoRow className="bg-white/60 border-b border-green-200 text-center animate-in fade-in slide-in-from-top-1 duration-200 block md:table-row">
                      <td className="p-3 hidden md:table-cell">
                        <CheckBox checked={false} disabled={true} onChange={() => { }} className="w-4 h-4 opacity-40" />
                      </td>
                      <td className="p-2 text-left block md:table-cell">
                        <TodoTextArea value={newContent} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewContent(e.target.value)} onKeyDown={handleKeyDown} rows={2} />
                      </td>
                      <td className="p-3 text-slate-400 text-xs font-mono hidden md:table-cell">—</td>
                      <td className="p-3 text-slate-400 text-xs font-mono hidden md:table-cell">Today</td>
                      <td className="p-3 text-slate-400 text-xs font-mono hidden md:table-cell">—</td>
                      <td className="p-2 block md:table-cell text-left md:text-center">
                        <div className="block md:hidden relative">
                          <div className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-700 flex justify-between items-center shadow-sm">
                            <span>{dueDate ? dueDate : "연도 - 월 - 일"}</span>
                            <span>📅</span>
                          </div>
                          <div className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10">
                            <DatePicker value={dueDate} min={getTodayString()} onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)} className="w-full h-full absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                        <div className="hidden md:block">
                          <DatePicker value={dueDate} min={getTodayString()} onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)} />
                        </div>
                      </td>
                      <td className="p-3 block md:table-cell">
                        <div className="flex gap-2 max-w-[200px] md:max-w-none">
                          <CommonButton onClick={() => handleCreateTodo()} text="✅" className="w-4 flex-1 bg-green-50 hover:bg-green-100 text-xs px-2 py-2 md:py-1 rounded border border-green-200 shadow-sm" />
                          <CommonButton onClick={() => setIsCreating(false)} text="❌" className="w-4 flex-1 bg-slate-50 hover:bg-slate-100 text-xs px-2 py-2 md:py-1 rounded border border-slate-200 shadow-sm" />
                        </div>
                      </td>
                    </TodoRow>
                  )}
                </TodoListBody>
              </TodoListContents>
            ) : (
              <Notice className="w-full h-full flex flex-col items-center justify-center text-slate-400 py-16">
                <span className="text-3xl mb-1">🍃</span>
                <p className="text-xs font-semibold">아직 등록된 할 일 항목이 존재하지 않습니다.</p>
              </Notice>
            )}
          </TodoListFrame>

          {/* 하단 제어 바 및 보정된 반응형 안내 문구 */}
          <BottomController>
            <p className="text-[11px] text-slate-600 font-medium">
              <span className="inline md:hidden">💡 할 일 내용을 터치하면 상세 메타데이터(경과일, 기한 등)를 확인할 수 있습니다.</span>
              <span className="hidden md:inline">💡 완료된 할 일에 마우스를 올리면 정확한 완료 일시가 표시됩니다.</span>
            </p>
            {!isCreating && isOwner && (
              <CreateButton onClick={() => setIsCreating(true)}>
                <span>➕</span> TODO 생성하기
              </CreateButton>
            )}
          </BottomController>
        </PostItContent>
      </ChalkboardFrame>
    </main>
  );
}