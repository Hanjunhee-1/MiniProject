"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import PaginationButton from "@/components/button/PaginationButton";
import { POSTIT_COLORS } from "@/constants/colors";
import MainPostIt from "@/components/postit/MainPostIt";
import { loginWithGoogle } from "@/api/auth";
import { getPostIts } from "@/api/postIts"; // 🌟 우리가 만든 API 함수 임포트

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

  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  // 백엔드 /auth API 실연동 핸들러
  const handleCredentialResponse = async (response: any) => {
    console.log("구글 ID 토큰 획득 성공. 백엔드로 검증 요청을 보냅니다.");
    try {
      const jwtToken = await loginWithGoogle(response.credential);
      setToken(jwtToken);
      console.log("실제 백엔드 JWT 발급 및 인증 완료.");
    } catch (error) {
      console.error("인증 연동 중 에러 발생:", error);
      alert("백엔드 API와의 실연동에 실패했습니다. 서버 상태를 확인하세요.");
    }
  };

  const { initializeGoogleSignIn } = useGoogleSignIn({
    token,
    setToken,
    buttonRef: googleBtnContainerRef,
  });

  // 실연동 데이터 패칭 유닛 (getPostIts API 적용)
  useEffect(() => {
    if (!token) return;

    const fetchPostIts = async () => {
      setIsLoading(true);
      try {
        // 쿼리 파라미터 스펙 객체 전달
        const data = await getPostIts(token, { filter, page: currentPage });

        if (data.success) {
          // 백엔드 명세 키인 "post-its"에서 안전하게 리스트 추출
          const fetchedList = data["post-its"] || [];
          setPostIts(fetchedList);

          // 백엔드에서 준 count와 pageSize를 사용하여 총 페이지 수 계산 (ex: 9개 데이터 / page당 8개 = 2페이지)
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
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
  };

  // ==========================================
  // [화면 1] 로그인 대기 상태
  // ==========================================
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

  // ==========================================
  // [화면 2] 로그인 완료 및 실데이터 칠판 대시보드
  // ==========================================
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-6 select-none">
      <LogoutButton
        onClick={() => { setToken(null); setPostIts([]); }}
        text="← 로그아웃"
        className="absolute top-4 left-4 bg-white/80 hover:bg-white text-xs px-3 py-1.5 rounded-md shadow-sm text-slate-700 font-medium"
      />

      <div className="w-full max-w-6xl h-[80vh] bg-[#234733] border-8 border-amber-900 rounded-lg shadow-2xl flex flex-col justify-between p-8 relative">
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
                    onClick={() => {
                      console.log(`선택된 포스트잇의 ID:${post.id}`);
                    }}
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