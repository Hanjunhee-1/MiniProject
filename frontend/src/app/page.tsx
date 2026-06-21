"use client";

import { useEffect, useState } from "react";
import { apiService, User, PostItData } from "@/services/api";
import PostIt, { PreviewTodo } from "@/components/common/PostIt";
import TodoModal from "@/components/common/TodoModal";
import FilterButton from "@/components/button/FilterButton";
import PaginationButton from "@/components/button/PaginationButton";
import { FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Home() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Board Data State
  const [postIts, setPostIts] = useState<PostItData[]>([]);
  const [todosMap, setTodosMap] = useState<Record<string, PreviewTodo[]>>({});
  
  // Board Filters & Pagination State
  const [boardFilter, setBoardFilter] = useState<"all" | "my">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostIts, setTotalPostIts] = useState(0);
  const POSTITS_PER_PAGE = 8;

  // Selected Post-it for TodoModal
  const [selectedPostIt, setSelectedPostIt] = useState<PostItData | null>(null);

  // Initialize Auth & Check Local Storage
  useEffect(() => {
    const initApp = async () => {
      await apiService.init();
      const user = apiService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    initApp();
  }, []);

  // Fetch board data when user, page, or filter changes
  useEffect(() => {
    if (currentUser) {
      loadBoardData();
    }
  }, [currentUser, currentPage, boardFilter]);

  // Render Google button once when logged out
  useEffect(() => {
    if (!currentUser) {
      const initGoogle = () => {
        if (typeof window !== "undefined" && (window as any).google) {
          (window as any).google.accounts.id.initialize({
            client_id: "329350783241-2g92guepmo00g6koqc0hsefvl6986hd5.apps.googleusercontent.com",
            callback: (response: any) => {
              handleGoogleCredential(response.credential);
            }
          });
          (window as any).google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            { theme: "outline", size: "large", width: 220 }
          );
        } else {
          setTimeout(initGoogle, 300);
        }
      };
      initGoogle();
    }
  }, [currentUser]);

  // Fetch post-its and todo previews
  const loadBoardData = async () => {
    try {
      const { items, count } = await apiService.getPostIts(currentPage, boardFilter);
      setPostIts(items);
      setTotalPostIts(count);

      // Fetch todo previews for each post-it
      const previews: Record<string, PreviewTodo[]> = {};
      for (const p of items) {
        const list = await apiService.getTodos(p.id);
        previews[p.id] = list.map(t => ({ text: t.text, completed: t.completed }));
      }
      setTodosMap(previews);
    } catch (e) {
      console.error("Failed to load board data", e);
    }
  };

  const handleGoogleCredential = async (credentialToken: string) => {
    try {
      const { user } = await apiService.loginWithGoogle(credentialToken);
      setCurrentUser(user);
      setCurrentPage(1);
    } catch (e) {
      console.error("Google Login failed", e);
      alert("로그인 검증에 실패했습니다. (백엔드가 실행 중인지 확인하세요)");
    }
  };

  const handleDeveloperBypass = async () => {
    try {
      const user = await apiService.loginDeveloperMock("wnswn@gmail.com", "한준희");
      setCurrentUser(user);
      setCurrentPage(1);
    } catch (e) {
      console.error("Developer login failed", e);
    }
  };

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await apiService.logout();
      setCurrentUser(null);
      setPostIts([]);
      setTodosMap({});
      setCurrentPage(1);
      setTotalPostIts(0);
    }
  };

  const totalPages = Math.ceil(totalPostIts / POSTITS_PER_PAGE) || 1;

  return (
    <main className="flex-1 w-full min-h-screen relative flex items-center justify-center bg-radial from-stone-800 to-stone-950 p-6 select-none overflow-y-auto">
      {/* Background overlay desk texture */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {!currentUser ? (
        /* Unauthenticated View: Minimalist 3D Peeling Login Card */
        <div className="flex flex-col items-center justify-center z-10">
          <div className="perspective-container relative w-72 h-72">
            {/* Underneath Container - holds Google Sign In button */}
            <div className="under-login-container gap-4">
              <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase font-sans mb-2">
                Sign In
              </h4>
              
              {/* Google Button mounting point */}
              <div id="google-signin-button" className="z-30 min-h-[40px] flex items-center justify-center" />
              
              {/* Developer Bypass for quick testing */}
              <button
                onClick={handleDeveloperBypass}
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest mt-2 font-sans font-bold border-b border-white/10 hover:border-white/30 pb-0.5"
              >
                Developer Bypass
              </button>
            </div>

            {/* Sticky note lying flat on top. On hover, it flips up! */}
            <div className="liftable-note absolute inset-0">
              <PostIt
                title="POST-IT"
                isMain={true}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated View: Chalkboard Screen */
        <div className="w-full max-w-6xl h-[680px] flex flex-col wood-frame chalkboard relative z-10 transition-all duration-500 animate-fade-in text-stone-200">
          {/* Top Board Tray: Chalk Title & User Profile Overlay */}
          <div className="px-8 pt-6 pb-2 flex items-center justify-between border-b border-white/5 relative">
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold tracking-wider chalk-text text-white uppercase font-sans">
                BOARD
              </h1>
              <p className="text-xs font-semibold chalk-text text-amber-200/50 mt-0.5 tracking-wider font-sans uppercase">
                Click post-its to manage tasks
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
              <span className="text-xs font-semibold tracking-wide">{currentUser.name}</span>
              <button 
                onClick={handleLogout} 
                className="text-stone-400 hover:text-red-400 transition-colors pl-3 border-l border-stone-700 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider"
              >
                <FaSignOutAlt size={12} />
                Logout
              </button>
            </div>
          </div>

          {/* Central Grid Area */}
          <div className="flex-1 px-8 py-6 flex items-center justify-center">
            {postIts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full h-[380px]">
                {postIts.map((p) => (
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
                {Array.from({ length: POSTITS_PER_PAGE - postIts.length }).map((_, idx) => (
                  <div 
                    key={`empty-${idx}`} 
                    className="h-[175px] aspect-square mx-auto w-full max-w-[190px] rounded border border-white/5 bg-white/[0.005]" 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="chalk-text text-xl opacity-60 italic">No post-its found.</p>
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
                text="ALL" 
                variant={boardFilter === "all" ? "active" : "default"}
                onClick={() => {
                  setBoardFilter("all");
                  setCurrentPage(1);
                }}
              />
              <FilterButton 
                text="MY BOARDS" 
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

            {/* Right Section: Spacer for layout balancing */}
            <div className="w-[120px]" />
          </div>
        </div>
      )}

      {/* Selected Todo Management Modal */}
      <TodoModal
        postIt={selectedPostIt}
        isOpen={selectedPostIt !== null}
        onClose={() => setSelectedPostIt(null)}
        currentUser={currentUser}
        onRefreshBoard={loadBoardData}
      />
    </main>
  );
}
