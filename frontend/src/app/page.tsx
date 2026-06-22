"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import PaginationButton from "@/components/button/PaginationButton";
import { POSTIT_COLORS } from "@/constants/colors";
import MainPostIt from "@/components/postit/MainPostIt";
import { getPostIts } from "@/api/postIts";

import { PostIt } from "@/types";
import LogoutButton from "@/components/button/LogoutButton";
import FilterButton from "@/components/button/FilterButton";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import DashBoardPostIt from "@/components/postit/DashBoardPostIt";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [postIts, setPostIts] = useState<PostIt[]>([]);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🌟 이 ref가 칠판 div와 매핑되어야 정상 좌표 계산이 시작됩니다.
  const blackboardRef = useRef<HTMLDivElement>(null);

  // [트랜지션 전용 상태] 클릭된 가상 포스트잇의 애니메이션 좌표 및 스타일 추적
  const [zoomedPostIt, setZoomedPostIt] = useState<{
    colorClass: string;
    style: React.CSSProperties;
  } | null>(null);

  const googleBtnContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { initializeGoogleSignIn } = useGoogleSignIn({
    token,
    setToken,
    buttonRef: googleBtnContainerRef,
  });

  // 브라우저 최초 진입 및 컴포넌트 재생성 시 토큰 복원 (자동 로그인)
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 실연동 데이터 패칭 유닛
  useEffect(() => {
    if (!token) return;

    const fetchPostIts = async () => {
      setIsLoading(true);
      try {
        const data = await getPostIts(token, { filter, page: currentPage });
        if (data.success) {
          const fetchedList = data["post-its"] || [];
          setPostIts(fetchedList);
          const calculatedTotalPages = Math.ceil(data.count / data.pageSize) || 1;
          setTotalPages(calculatedTotalPages);
        } else {
          console.error("포스트잇 목록 로드 실패");
        }
      } catch (error) {
        console.error("API GET 요청 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostIts();
  }, [token, filter, currentPage]);

  const handleFilterChange = () => {
    setFilter(prev => (prev === "all" ? "mine" : "all"));
    setCurrentPage(1);
  };

  // [핵심 인터랙션 함수] 클릭한 그리드 카드의 좌표를 따서 대형 포스트잇으로 변환
  const handlePostItClick = (rect: DOMRect, post: PostIt, colorClass: string) => {
    const blackboard = blackboardRef.current;
    if (!blackboard) {
      router.push(`/post-its/${post.id}?color=${encodeURIComponent(colorClass)}`);
      return;
    }

    const boardRect = blackboard.getBoundingClientRect();

    // 1단계: 원본 카드의 위치와 고유 colorClass를 함께 상태에 저장
    setZoomedPostIt({
      colorClass, // 💡 선택한 포스트잇 고유의 Tailwind 클래스 (예: bg-[#D4F1E7] 등)
      style: {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: 50,
        transition: "all 800ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    });

    // 2단계: 800ms 동안 칠판 프레임 크기만큼 확장 유도
    setTimeout(() => {
      setZoomedPostIt((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          style: {
            ...prev.style,
            top: `${boardRect.top + 32}px`,
            left: `${boardRect.left + 32}px`,
            width: `${boardRect.width - 64}px`,
            height: `${boardRect.height - 64}px`,
            borderRadius: "0.5rem",
          },
        };
      });
    }, 20);

    // 3단계: 애니메이션이 종료되면 쿼리 스트링으로 색상값을 들고 상세페이지로 이동
    setTimeout(() => {
      router.push(`/post-its/${post.id}?color=${encodeURIComponent(colorClass)}`);
    }, 820);
  };

  if (!token) {
    return (
      <>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={initializeGoogleSignIn}
        />
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-4 select-none">
          <MainPostIt ref={googleBtnContainerRef} />
        </main>
      </>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-6 select-none">
      {/* 트랜지션 애니메이션 오버레이 렌더링 구역 */}
      {zoomedPostIt && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-500" />
          <div
            // 💡 bg-[#FFFDEE] 대신 원본 포스트잇의 colorClass를 그대로 이어받습니다.
            className={`shadow-2xl flex flex-col justify-between p-8 z-50 text-slate-800 ${zoomedPostIt.colorClass}`}
            style={zoomedPostIt.style}
          >
            <div className="w-full flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-800 tracking-wide">
                  📌 Task Board
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">포스트잇 고유 식별코드: 연동 중...</p>
              <div className="w-full h-[1px] bg-slate-800/10 my-4" />

              <div className="flex-1 border border-dashed border-slate-400/40 rounded bg-white/30 flex items-center justify-center">
                <p className="text-sm font-semibold text-slate-500/80 animate-pulse">
                  할 일 목록 리스트를 불러오고 있습니다...
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <LogoutButton
        onClick={() => { localStorage.removeItem("accessToken"); setToken(null); setPostIts([]); }}
        text="← 로그아웃"
        className="absolute top-4 left-4 bg-white/80 hover:bg-white text-xs px-3 py-1.5 rounded-md shadow-sm text-slate-700 font-medium"
      />

      {/* 🌟 중요: 칠판 컨테이너 레이어에 ref={blackboardRef}를 안전하게 주입 완료했습니다! */}
      <div
        ref={blackboardRef}
        className="w-full max-w-6xl h-[80vh] bg-[#234733] border-8 border-amber-900 rounded-lg shadow-2xl flex flex-col justify-between p-8 relative"
      >
        <div className="h-[10%] flex items-center justify-between border-b border-green-700 pb-2">
          <span className="text-white font-bold text-2xl tracking-wide">
            ✏️ {filter === "all" ? "모두의 포스트잇" : "내 포스트잇"}
          </span>
          <span className="text-green-300 text-sm font-medium">현재 페이지: {currentPage} / {totalPages}</span>
        </div>

        <div className="h-[85%] w-full flex gap-6 my-4">
          {/* 포스트잇 배치 그리드 */}
          <div className="w-3/4 h-full grid grid-cols-4 grid-rows-2 gap-4 border border-dashed border-green-800/40 rounded-md p-4 items-center justify-items-center bg-black/5">
            {isLoading ? (
              <div className="text-green-300 text-sm font-bold col-span-4 row-span-2 flex items-center justify-center animate-pulse">
                백엔드 통신 중...
              </div>
            ) : postIts && postIts.length > 0 ? (
              postIts.map((post) => {
                const colorClass = POSTIT_COLORS[post.id % POSTIT_COLORS.length];
                return (
                  <DashBoardPostIt
                    key={post.id}
                    post={post}
                    colorClass={colorClass}
                    onClick={(rect) => handlePostItClick(rect, post, colorClass)}
                  />
                );
              })
            ) : (
              <div className="text-green-200/40 text-sm font-bold col-span-4 row-span-2 flex items-center justify-center">
                조회된 포스트잇이 없습니다.
              </div>
            )}
          </div>

          {/* 사이드 제어 바 */}
          <div className="w-1/4 h-full flex flex-col items-center justify-between border-l border-green-700/50 pl-4">
            <div className="flex flex-col items-center gap-6 mt-4">
              <PaginationButton
                direction="up"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              <div className="text-center bg-green-900/40 border border-green-700/60 px-4 py-2 rounded-md min-w-[100px]">
                <p className="text-xs text-green-300 font-semibold uppercase">Page</p>
                <p className="text-2xl font-black text-white tracking-widest mt-0.5">
                  {currentPage} <span className="text-sm font-normal text-green-400">/</span> {totalPages}
                </p>
              </div>
              <PaginationButton
                direction="down"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </div>

            <FilterButton
              onClick={handleFilterChange}
              variant={filter === "mine" ? "active" : "default"}
              text={filter === "all" ? "내 포스트잇 보기" : "모두의 포스트잇 보기"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}