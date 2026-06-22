import { forwardRef } from "react";
import BasePostIt from "./BasePostIt";

type MainPostItProps = {
    className?: string;
}

const MainPostIt = forwardRef<HTMLDivElement, MainPostItProps>(({ className }, ref) => {
    return (
        <BasePostIt
            className={`group overflow-hidden relative w-80 h-80 bg-yellow-100 border border-yellow-200 shadow-md transition-all duration-300 group-hover:border-r-transparent group-hover:border-b-transparent ${className || ""}`}
        >
            {/* 타이틀 구역 */}
            <div className="p-2">
                <h1 className="text-xl font-bold mb-1 text-slate-700">Post-it</h1>
            </div>

            {/* 안내 문구 구역 */}
            <div className="absolute inset-0 flex items-center justify-center pb-12">
                <p className="font-medium text-slate-600 text-sm animate-pulse group-hover:opacity-0 transition-opacity duration-200">
                    hover to login ➔
                </p>
            </div>

            {/* 우측 하단 접히는 모서리 및 구글 버튼 컨테이너 */}
            <div className="absolute bottom-0 right-0 w-24 h-24">
                {/* 🌟 평소에는 0이었다가 마우스를 올렸을 때만(group-hover) 96px로 커지며 배경색과 동일한 삼각형으로 깎아냅니다 */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[0px] border-t-transparent border-r-[0px] border-r-[#EEDCB3] z-20 transition-all duration-500 group-hover:border-t-[96px] group-hover:border-r-[96px]" />

                {/* 🌟 접혀 올라간 포스트잇의 뒷면 레이어도 평소에는 0이다가 호버 시에 맞춰 확장되도록 반전시켰습니다 */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[0px] border-b-yellow-200 border-l-[0px] border-l-transparent z-10 transition-all duration-500 group-hover:border-b-[96px] group-hover:border-l-[96px]" />

                {/* 부모에게 전달받은 ref를 여기에 연결하여 구글 SDK가 버튼을 이 안에 그리도록 합니다. */}
                <div
                    ref={ref}
                    className="absolute bottom-5 right-5 z-30 opacity-0 scale-75 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:scale-100"
                />
            </div>
        </BasePostIt>
    );
});

MainPostIt.displayName = "MainPostIt";

export default MainPostIt;