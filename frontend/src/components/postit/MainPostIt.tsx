import { forwardRef, useState } from "react";
import BasePostIt from "./BasePostIt";

type MainPostItProps = {
  className?: string;
}

const MainPostIt = forwardRef<HTMLDivElement, MainPostItProps>(({ className }, ref) => {
  // 모바일 터치 상태를 저장할 스테이트 추가
  const [isFlipped, setIsFlipped] = useState(false);

  // PC group-hover 스타일과 모바일 isFlipped 스타일을 결합하는 헬퍼 상수
  const activeClass = "group-hover:border-r-transparent group-hover:border-b-transparent" + (isFlipped ? " border-r-transparent border-b-transparent" : "");
  const foldTopClass = "group-hover:border-t-[96px] group-hover:border-r-[96px]" + (isFlipped ? " border-t-[96px] border-r-[96px]" : "");
  const foldBottomClass = "group-hover:border-b-[96px] group-hover:border-l-[96px]" + (isFlipped ? " border-b-[96px] border-l-[96px]" : "");
  const btnClass = "group-hover:opacity-100 group-hover:scale-100" + (isFlipped ? " opacity-100 scale-100" : " opacity-0 scale-75");
  const textClass = "group-hover:opacity-0" + (isFlipped ? " opacity-0" : "");

  return (
    <BasePostIt
      // 터치할 때마다 상태를 반전(토글). 포스트잇 아무 데나 누르면 들춰지고, 다시 누르면 닫힘.
      onTouchStart={() => setIsFlipped(!isFlipped)}
      className={`group overflow-hidden relative w-80 h-80 bg-yellow-100 border border-yellow-200 shadow-md transition-all duration-300 ${activeClass} ${className || ""}`}
    >
      {/* 타이틀 구역 */}
      <div className="p-2">
        <h1 className="text-xl font-bold mb-1 text-slate-700">Post-it</h1>
      </div>

      {/* 안내 문구 구역 */}
      <div className="absolute inset-0 flex items-center justify-center pb-12">
        <p className={`font-medium text-slate-600 text-sm animate-pulse transition-opacity duration-200 ${textClass}`}>
          <span className="inline md:hidden">click to login ➔</span>
          <span className="hidden md:inline">hover to login ➔</span>
        </p>
      </div>

      {/* 우측 하단 접히는 모서리 및 구글 버튼 컨테이너 */}
      <div className="absolute bottom-0 right-0 w-24 h-24">
        {/* 배경 깎아내는 삼각형 */}
        <div className={`absolute bottom-0 right-0 w-0 h-0 border-t-[0px] border-t-transparent border-r-[0px] border-r-[#EEDCB3] z-20 transition-all duration-500 ${foldTopClass}`} />

        {/* 접혀 올라간 포스트잇 뒷면 */}
        <div className={`absolute bottom-0 right-0 w-0 h-0 border-b-[0px] border-b-yellow-200 border-l-[0px] border-l-transparent z-10 transition-all duration-500 ${foldBottomClass}`} />

        {/* 구글 로그인 버튼 */}
        <div
          ref={ref}
          className={`absolute bottom-5 right-5 z-30 transition-all duration-500 delay-100 ${btnClass}`}
        />
      </div>
    </BasePostIt>
  );
});

MainPostIt.displayName = "MainPostIt";

export default MainPostIt;