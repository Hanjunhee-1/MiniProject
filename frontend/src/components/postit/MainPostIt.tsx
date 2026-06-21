import { forwardRef } from "react";
import BasePostIt from "./BasePostIt";

type MainPostItProps = {
    className?: string;
}

// forwardRef를 사용하여 부모(page.tsx)로부터 받은 ref를 구글 버튼 container div에 바인딩합니다.
const MainPostIt = forwardRef<HTMLDivElement, MainPostItProps>(({ className }, ref) => {
    return (
        <BasePostIt className={`group overflow-hidden relative w-80 h-80 bg-yellow-100 border border-yellow-200 shadow-md ${className || ""}`}>
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
                <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[96px] border-t-transparent border-r-[96px] border-r-[#EEDCB3] z-20 transition-all duration-500 group-hover:border-t-[0px] group-hover:border-r-[0px]" />
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