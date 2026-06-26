"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import PaginationButton from "@/components/button/PaginationButton";
import { POSTIT_COLORS } from "@/constants/colors";
import MainPostIt from "@/components/postit/MainPostIt";
import { getPostIts } from "@/api/postIts";

import { PostIt } from "@/types";
import FilterButton from "@/components/button/FilterButton";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import DashBoardPostIt from "@/components/postit/DashBoardPostIt";
import Title from "@/components/common/Title";
import ChalkboardFrame from "@/components/dashboard/ChalkboardFrame";
import ChalkboardContent from "@/components/dashboard/ChalkboardContent";
import Notice from "@/components/common/Notice";
import GridPostIt from "@/components/postit/GridPostIt";
import SideController from "@/components/common/SideController";
import PaginationFrame from "@/components/common/PaginationFrame";
import PaginationNotice from "@/components/common/PaginationNotice";
import ZoomedPostItOverlay from "@/components/postit/ZoomedPostItOverlay";
import CommonButton from "@/components/button/CommonButton";
import dynamic from "next/dynamic";

function Home() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") { // SSR(Next.js) 환경 방어 코드
      return localStorage.getItem("accessToken");
    }
    return null;
  });
  const [postIts, setPostIts] = useState<PostIt[]>([]);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const blackboardRef = useRef<HTMLDivElement>(null);

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
  const handlePostItClick = (rect: DOMRect, post: PostIt) => {
    const blackboard = blackboardRef.current;

    const colorClass = POSTIT_COLORS[post.user_id % POSTIT_COLORS.length];
    if (!blackboard) {
      router.push(`/post-its/${post.id}?color=${encodeURIComponent(colorClass)}&ownerId=${post.user_id}`);
      return;
    }

    const boardRect = blackboard.getBoundingClientRect();

    setZoomedPostIt({
      colorClass,
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

    setTimeout(() => {
      router.push(`/post-its/${post.id}?color=${encodeURIComponent(colorClass)}&ownerId=${post.user_id}`);
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
      <ZoomedPostItOverlay data={zoomedPostIt} />

      <CommonButton
        onClick={() => { localStorage.removeItem("accessToken"); setToken(null); setPostIts([]); }}
        text="← 로그아웃"
        className="
          relative w-full mb-4 justify-center text-center bg-white/80 hover:bg-white text-xs px-3 py-2.5 rounded-md shadow-sm text-slate-700 font-medium
          md:absolute md:top-4 md:left-4 md:w-auto md:mb-0 md:py-1.5
        "
      />

      {/* 칠판 전체 프레임 */}
      <ChalkboardFrame ref={blackboardRef}>
        <Title
          className="h-[10%] flex items-center justify-between border-b border-green-700 pb-2"
        >
          <span className="text-white font-bold text-2xl tracking-wide">
            ✏️ {filter === "all" ? "모두의 포스트잇" : "내 포스트잇"}
          </span>
        </Title>

        <ChalkboardContent>
          {/* 포스트잇 배치 그리드 2x8 */}
          <GridPostIt>
            {isLoading ? (
              <Notice className="text-green-300 text-sm font-bold col-span-4 row-span-2 flex items-center justify-center animate-pulse">
                백엔드 통신 중...
              </Notice>
            ) : postIts && postIts.length > 0 ? (
              postIts.map((post) => {
                const colorClass = POSTIT_COLORS[post.user_id % POSTIT_COLORS.length];
                return (
                  <DashBoardPostIt
                    key={post.id}
                    post={post}
                    colorClass={colorClass}
                    onClick={(rect) => handlePostItClick(rect, post)}
                  />
                );
              })
            ) : (
              <Notice className="text-green-200/40 text-sm font-bold col-span-4 row-span-2 flex items-center justify-center">
                조회된 포스트잇이 없습니다
              </Notice>
            )}
          </GridPostIt>

          {/* 사이드 제어 바 */}
          <SideController>
            <PaginationFrame>
              <PaginationButton
                direction="up"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              <PaginationNotice>
                <p className="text-xs text-green-300 font-semibold uppercase">Page</p>
                <p className="text-2xl font-black text-white tracking-widest mt-0.5">
                  {currentPage} <span className="text-sm font-normal text-green-400">/</span> {totalPages}
                </p>
              </PaginationNotice>
              <PaginationButton
                direction="down"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationFrame>

            <FilterButton
              onClick={handleFilterChange}
              variant={filter === "mine" ? "active" : "default"}
              text={filter === "all" ? "내 포스트잇 보기" : "모두의 포스트잇 보기"}
            />
          </SideController>
        </ChalkboardContent>
      </ChalkboardFrame>
    </main>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
})