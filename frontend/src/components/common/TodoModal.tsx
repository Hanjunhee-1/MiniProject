import React, { useState, useEffect } from "react";
import { apiService, Todo, PostItData, User } from "../../services/api";
import FilterButton from "../button/FilterButton";
import OkButton from "../button/OkButton";
import { FaTrash, FaPlus, FaCheck } from "react-icons/fa";

interface TodoModalProps {
  postIt: PostItData | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onRefreshBoard: () => void;
}

const COLOR_MAP = {
  yellow: {
    bg: "bg-[#fef9c3]",      // yellow-100 (slightly lighter than card for readability)
    headerBg: "bg-[#fef08a]",// yellow-200
    border: "border-amber-200",
    text: "text-amber-950",
    accent: "bg-amber-600 hover:bg-amber-700 text-white"
  },
  pink: {
    bg: "bg-[#fdf2f8]",      // pink-50
    headerBg: "bg-[#fbcfe8]",// pink-200
    border: "border-pink-200",
    text: "text-pink-950",
    accent: "bg-pink-600 hover:bg-pink-700 text-white"
  },
  blue: {
    bg: "bg-[#f0f9ff]",      // sky-50
    headerBg: "bg-[#bfdbfe]",// blue-200
    border: "border-blue-200",
    text: "text-blue-950",
    accent: "bg-blue-600 hover:bg-blue-700 text-white"
  },
  green: {
    bg: "bg-[#f0fdf4]",      // green-50
    headerBg: "bg-[#bbf7d0]",// green-200
    border: "border-green-200",
    text: "text-green-950",
    accent: "bg-green-600 hover:bg-green-700 text-white"
  },
  purple: {
    bg: "bg-[#faf5ff]",      // purple-50
    headerBg: "bg-[#e9d5ff]",// purple-200
    border: "border-purple-200",
    text: "text-purple-950",
    accent: "bg-purple-600 hover:bg-purple-700 text-white"
  }
};

export default function TodoModal({
  postIt,
  isOpen,
  onClose,
  currentUser,
  onRefreshBoard
}: TodoModalProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && postIt) {
      loadTodos();
    }
  }, [isOpen, postIt]);

  const loadTodos = async () => {
    if (!postIt) return;
    setIsLoading(true);
    try {
      const data = await apiService.getTodos(postIt.id);
      setTodos(data);
    } catch (e) {
      console.error("Failed to load todos", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !postIt) return null;

  const colorInfo = COLOR_MAP[postIt.color] || COLOR_MAP.yellow;

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const newTodo = await apiService.createTodo(postIt.id, newTodoText.trim());
      setTodos(prev => [...prev, newTodo]);
      setNewTodoText("");
      onRefreshBoard();
    } catch (e) {
      console.error("Failed to add todo", e);
    }
  };

  const handleToggleTodo = async (id: string, currentCompleted: boolean) => {
    try {
      const updated = await apiService.toggleTodo(postIt.id, id, !currentCompleted);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
      onRefreshBoard();
    } catch (e) {
      console.error("Failed to toggle todo", e);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await apiService.deleteTodo(postIt.id, id);
      setTodos(prev => prev.filter(t => t.id !== id));
      onRefreshBoard();
    } catch (e) {
      console.error("Failed to delete todo", e);
    }
  };

  const filteredTodos = todos.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const isOwner = currentUser?.id === postIt.ownerId;

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-lg rounded-md shadow-2xl border ${colorInfo.border} overflow-hidden flex flex-col transition-all duration-300 transform scale-100 ${colorInfo.bg} ${colorInfo.text} handwriting`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b border-black/10 flex items-center justify-between ${colorInfo.headerBg}`}>
          <h2 className="text-2xl font-bold tracking-wide truncate pr-4">
            {postIt.title}
          </h2>
          <span className="text-[11px] font-mono opacity-65 bg-black/5 px-2 py-0.5 rounded">
            생성일: {postIt.date}
          </span>
        </div>

        {/* Todo List Area */}
        <div className="p-6 flex-1 flex flex-col min-h-[250px] max-h-[380px] overflow-y-auto">
          {/* Add Todo Form - Only visible to owner */}
          {isOwner ? (
            <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="새로운 할일을 입력하세요..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/60 border border-black/20 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm font-semibold placeholder-black/35"
              />
              <button
                type="submit"
                className={`p-2 rounded flex items-center justify-center transition-all ${colorInfo.accent}`}
              >
                <FaPlus size={16} />
              </button>
            </form>
          ) : (
            <div className="text-xs bg-black/5 px-3 py-2 rounded mb-4 italic text-center font-bold">
              다른 사람의 포스트잇은 조회만 가능합니다.
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-1.5 mb-4 pb-2 border-b border-black/5 text-sm">
            <FilterButton 
              text="전체" 
              variant={filter === "all" ? "active" : "default"} 
              onClick={() => setFilter("all")} 
            />
            <FilterButton 
              text="진행 중" 
              variant={filter === "active" ? "active" : "default"} 
              onClick={() => setFilter("active")} 
            />
            <FilterButton 
              text="완료됨" 
              variant={filter === "completed" ? "active" : "default"} 
              onClick={() => setFilter("completed")} 
            />
          </div>

          {/* List Content */}
          <div className="flex-1 space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-sm opacity-60 animate-pulse">로딩 중...</div>
            ) : filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <div 
                  key={todo.id}
                  className="flex items-center justify-between gap-3 p-2 bg-white/30 hover:bg-white/50 rounded border border-black/5 transition-all group/item"
                >
                  <button
                    type="button"
                    disabled={!isOwner}
                    onClick={() => handleToggleTodo(todo.id, todo.completed)}
                    className={`
                      w-5 h-5 flex items-center justify-center rounded border border-black/30 bg-white/50
                      ${isOwner ? "hover:bg-white cursor-pointer" : "cursor-default opacity-80"} transition-colors
                    `}
                  >
                    {todo.completed && <FaCheck size={10} className="text-amber-800" />}
                  </button>
                  <span 
                    onClick={() => isOwner && handleToggleTodo(todo.id, todo.completed)}
                    className={`flex-1 text-sm font-bold truncate select-none ${isOwner ? "cursor-pointer" : "cursor-default"} ${todo.completed ? "line-through opacity-40 font-normal" : "opacity-90"}`}
                  >
                    {todo.text}
                  </span>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="opacity-0 group-hover/item:opacity-75 hover:opacity-100 hover:text-red-700 p-1 text-stone-500 transition-opacity"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm opacity-40 italic">
                {filter === "all" ? "할일이 없습니다." : filter === "active" ? "진행 중인 할일이 없습니다." : "완료된 할일이 없습니다."}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-black/5 border-t border-black/10 flex items-center justify-end">
          <OkButton 
            onClick={onClose} 
            className="shadow-md hover:scale-102"
            text="닫기"
          />
        </div>
      </div>
    </div>
  );
}
