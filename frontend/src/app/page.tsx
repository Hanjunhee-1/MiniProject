"use client";

import { useEffect, useState } from "react";
import { apiService, User, PostItData, Todo } from "@/services/api";
import PostIt, { PostItColor, PreviewTodo } from "@/components/common/PostIt";
import GoogleLoginModal from "@/components/common/GoogleLoginModal";
import TodoModal from "@/components/common/TodoModal";
import FilterButton from "@/components/button/FilterButton";
import PaginationButton from "@/components/button/PaginationButton";
import OkButton from "@/components/button/OkButton";
import { FaSignOutAlt, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Home() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Board Data State
  const [postIts, setPostIts] = useState<PostItData[]>([]);
  const [todosMap, setTodosMap] = useState<Record<string, PreviewTodo[]>>({});
  
  // Board Filters & Pagination State
  const [boardFilter, setBoardFilter] = useState<"all" | "my">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const POSTITS_PER_PAGE = 8;

  // Selected Post-it for TodoModal
  const [selectedPostIt, setSelectedPostIt] = useState<PostItData | null>(null);

  // New Post-it Creation Modal State
  const [isNewPostItOpen, setIsNewPostItOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState<PostItColor>("yellow");

  // Initialize Auth & Load Data
  useEffect(() => {
    const initApp = async () => {
      await apiService.init();
      const user = apiService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        loadBoardData();
      }
    };
    initApp();
  }, []);

  // Fetch all board post-its and their todo previews
  const loadBoardData = async () => {
    try {
      const posts = await apiService.getPostIts();
      setPostIts(posts);

      // Fetch todo previews for each post-it
      const previews: Record<string, PreviewTodo[]> = {};
      for (const p of posts) {
        const list = await apiService.getTodos(p.id);
        previews[p.id] = list.map(t => ({ text: t.text, completed: t.completed }));
      }
      setTodosMap(previews);
    } catch (e) {
      console.error("Failed to load board data", e);
    }
  };

  const handleGoogleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleSelectAccount = async (email: string, name: string) => {
    try {
      const user = await apiService.loginWithGoogle(email, name);
      setCurrentUser(user);
      setIsLoginModalOpen(false);
      // Wait for state update then fetch board data
      setTimeout(() => {
        loadBoardData();
      }, 50);
    } catch (e) {
      console.error("Google Login failed", e);
    }
  };

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await apiService.logout();
      setCurrentUser(null);
      setPostIts([]);
      setTodosMap({});
      setCurrentPage(1);
    }
  };

  const handleCreatePostIt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await apiService.createPostIt(newTitle.trim(), newColor);
      setIsNewPostItOpen(false);
      setNewTitle("");
      setNewColor("yellow");
      await loadBoardData();
      // Go to first page to see the newly created post-it (which is added at the start)
      setCurrentPage(1);
    } catch (e) {
      console.error("Failed to create post-it", e);
    }
  };

  const handleDeletePostIt = async (id: string) => {
    try {
      await apiService.deletePostIt(id);
      setSelectedPostIt(null);
      await loadBoardData();
      // If page is now empty, go to previous page
      const totalFiltered = postIts.filter(p => boardFilter === "all" || p.ownerEmail === currentUser?.email).length - 1;
      const totalPages = Math.ceil(totalFiltered / POSTITS_PER_PAGE) || 1;
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    } catch (e) {
      console.error("Failed to delete post-it", e);
    }
  };

  // Open creation modal with default title
  const handleOpenNewPostIt = () => {
    setNewTitle(`${currentUser?.name || "익명"}의 포스트잇`);
    setNewColor("yellow");
    setIsNewPostItOpen(true);
  };

  // Filter and Paginate post-its
  const filteredPostIts = postIts.filter(p => {
    if (boardFilter === "my") {
      return p.ownerEmail === currentUser?.email;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredPostIts.length / POSTITS_PER_PAGE) || 1;
  const paginatedPostIts = filteredPostIts.slice(
    (currentPage - 1) * POSTITS_PER_PAGE,
    currentPage * POSTITS_PER_PAGE
  );

  return (
    <main className="flex-1 w-full min-h-screen relative flex items-center justify-center bg-radial from-stone-800 to-stone-950 p-6 select-none overflow-y-auto">
      {/* Background overlay desk texture */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {!currentUser ? (
        /* Unauthenticated View: Main Login Screen */
        <div className="flex flex-col items-center gap-8 z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center font-sans tracking-tight drop-shadow-lg">
            📝 SKKU <span className="text-amber-300">POST-IT</span> BOARD
          </h1>
          <div className="relative p-2 bg-stone-900/40 rounded-xl backdrop-blur-md border border-stone-800 shadow-2xl">
            <PostIt
              title="SKKU POST-IT"
              isMain={true}
              onGoogleLogin={handleGoogleLoginClick}
            />
          </div>
          <p className="text-stone-400 text-xs md:text-sm font-medium tracking-wide">
            © 2026 성균관대학교 산학협력 프로젝트 뉴로플로우
          </p>
        </div>
      ) : (
        /* Authenticated View: Chalkboard Screen */
        <div className="w-full max-w-6xl h-[680px] flex flex-col wood-frame chalkboard relative z-10 transition-all duration-500 animate-fade-in text-stone-200">
          {/* Top Board Tray: Chalk Title & User Profile Overlay */}
          <div className="px-8 pt-6 pb-2 flex items-center justify-between border-b border-white/5 relative">
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold tracking-wider chalk-text text-white">
                💡 할일 포스트잇 게시판
              </h1>
              <p className="text-xs font-semibold chalk-text text-amber-200/60 mt-0.5">
                포스트잇을 클릭해 할일을 관리하세요.
              </p>
            </div>

            {/* Profile Overlay */}
            <div className="flex items-center gap-3 bg-stone-800/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-700 text-stone-200 shadow-lg">
              {currentUser.avatarUrl && (
                <img 
                  src={currentUser.avatarUrl} 
                  alt="avatar" 
                  className="w-7 h-7 rounded-full bg-stone-700 border border-stone-600 shadow-inner" 
                />
              )}
              <span className="text-xs font-semibold tracking-wide">{currentUser.name} 님</span>
              <button 
                onClick={handleLogout} 
                className="text-stone-400 hover:text-red-400 transition-colors pl-3 border-l border-stone-700 text-xs flex items-center gap-1.5 font-bold"
              >
                <FaSignOutAlt size={12} />
                로그아웃
              </button>
            </div>
          </div>

          {/* Central Grid Area */}
          <div className="flex-1 px-8 py-6 flex items-center justify-center">
            {paginatedPostIts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full h-[380px]">
                {paginatedPostIts.map((p) => (
                  <div key={p.id} className="h-[175px] aspect-square mx-auto w-full max-w-[190px]">
                    <PostIt
                      id={p.id}
                      title={p.title}
                      date={p.date}
                      color={p.color}
                      previewTodos={todosMap[p.id] || []}
                      onClick={() => setSelectedPostIt(p)}
                    />
                  </div>
                ))}
                {/* Pad empty spaces to maintain exact alignment */}
                {Array.from({ length: POSTITS_PER_PAGE - paginatedPostIts.length }).map((_, idx) => (
                  <div 
                    key={`empty-${idx}`} 
                    className="h-[175px] aspect-square mx-auto w-full max-w-[190px] rounded border-2 border-dashed border-white/5 bg-white/[0.01]" 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="chalk-text text-xl opacity-60 italic">등록된 포스트잇이 없습니다.</p>
                <button
                  onClick={handleOpenNewPostIt}
                  className="mt-4 px-4 py-2 border border-dashed border-white/30 rounded-md chalk-text text-amber-200 hover:border-amber-300 hover:text-amber-100 transition-all text-sm font-semibold"
                >
                  첫 포스트잇 작성하기 +
                </button>
              </div>
            )}
          </div>

          {/* Chalkboard Wooden Tray (Bottom bar) */}
          <div className="bg-[#422c1b] border-t-2 border-[#2b1c10] h-16 flex items-center justify-between px-8 shadow-2xl relative">
            {/* Tray Chalk/Eraser Decorative Items */}
            <div className="absolute -top-1.5 left-24 flex gap-4 pointer-events-none">
              {/* White chalk */}
              <div className="w-10 h-2 bg-stone-100/90 rounded-xs shadow-md transform rotate-12" />
              {/* Pink chalk */}
              <div className="w-8 h-2 bg-pink-300/80 rounded-xs shadow-md transform -rotate-6" />
              {/* Chalk eraser */}
              <div className="w-16 h-4 bg-stone-800 rounded border border-amber-900 shadow-md flex flex-col justify-between">
                <div className="bg-stone-400 h-1.5 w-full rounded-t-xs" />
              </div>
            </div>

            {/* Left Section: Board Filters */}
            <div className="flex gap-2">
              <FilterButton 
                text="모든 포스트잇" 
                variant={boardFilter === "all" ? "active" : "default"}
                onClick={() => {
                  setBoardFilter("all");
                  setCurrentPage(1);
                }}
              />
              <FilterButton 
                text="내 포스트잇" 
                variant={boardFilter === "my" ? "active" : "default"}
                onClick={() => {
                  setBoardFilter("my");
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Center Section: Pagination */}
            <div className="flex items-center gap-2">
              <PaginationButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft size={10} />
              </PaginationButton>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationButton
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </PaginationButton>
              ))}

              <PaginationButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight size={10} />
              </PaginationButton>
            </div>

            {/* Right Section: Add Button */}
            <div>
              <button
                onClick={handleOpenNewPostIt}
                className="flex items-center gap-1.5 px-4 h-10 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-amber-950 font-bold border border-amber-500 rounded shadow-md hover:scale-103 active:scale-97 transition-all text-sm font-sans"
              >
                <FaPlus size={12} />
                새 포스트잇 작성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Login Selector Modal */}
      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectAccount={handleSelectAccount}
      />

      {/* Selected Todo Management Modal */}
      <TodoModal
        postIt={selectedPostIt}
        isOpen={selectedPostIt !== null}
        onClose={() => setSelectedPostIt(null)}
        onDeletePostIt={handleDeletePostIt}
        currentUser={currentUser}
        onRefreshBoard={loadBoardData}
      />

      {/* New Post-it Creation Modal */}
      {isNewPostItOpen && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setIsNewPostItOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-stone-900 rounded-lg shadow-2xl border border-stone-800 overflow-hidden flex flex-col transition-all text-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-wide font-sans">새 포스트잇 추가</h2>
              <button 
                onClick={() => setIsNewPostItOpen(false)} 
                className="text-stone-400 hover:text-stone-200 text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreatePostIt} className="p-6 space-y-5 font-sans">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1.5">포스트잇 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동의 포스트잇"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-850 border border-stone-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-2">포스트잇 색상 선택</label>
                <div className="flex gap-4">
                  {(["yellow", "pink", "blue", "green", "purple"] as PostItColor[]).map((col) => {
                    const bgColors = {
                      yellow: "bg-[#fef08a]",
                      pink: "bg-[#fbcfe8]",
                      blue: "bg-[#bfdbfe]",
                      green: "bg-[#bbf7d0]",
                      purple: "bg-[#e9d5ff]"
                    };
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewColor(col)}
                        className={`
                          w-8 h-8 rounded-full ${bgColors[col]} border-2 
                          ${newColor === col ? "border-amber-400 scale-110 shadow-lg" : "border-stone-700 scale-100 hover:scale-105 opacity-80 hover:opacity-100"}
                          transition-all duration-150
                        `}
                        title={col}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostItOpen(false)}
                  className="flex-1 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-sm font-medium transition-colors border border-stone-700"
                >
                  취소
                </button>
                <OkButton
                  onClick={() => {}}
                  className="flex-1"
                  text="생성하기"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
