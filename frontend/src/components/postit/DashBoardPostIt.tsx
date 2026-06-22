import { PostIt } from "@/types";
import BasePostIt from "./BasePostIt";

type DashBoardPostItProps = {
    post: PostIt;
    colorClass?: string;
    onClick?: () => void;
};

export default function DashBoardPostIt({ post, colorClass, onClick }: DashBoardPostItProps) {
    return (
        <BasePostIt
            onClick={onClick}
            colorClass={colorClass}
            className="group relative overflow-hidden w-full h-full flex flex-col justify-between transform transition-all duration-300 hover:scale-105 group-hover:border-r-transparent group-hover:border-b-transparent"
        >
            {/* 콘텐츠 상단 영역 */}
            <div className="p-1">
                <div className="text-sm font-black text-slate-800 tracking-wide break-all">
                    {post.user_name || "Unknown"}'s Board
                </div>
                <div className="w-full h-[1px] bg-slate-800/10 my-2" />

                <p className="text-xs text-slate-600 font-medium mt-1 transition-opacity duration-300 group-hover:opacity-0">
                    작업 목록 확인하기 ➔
                </p>
            </div>

            {/* 날짜 하단 영역 */}
            <div className="absolute bottom-3 right-4 text-[10px] font-mono font-bold text-slate-700 z-10 transition-opacity duration-300 group-hover:opacity-0">
                {post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
            </div>

            {/* 오른쪽 아래 호버 시에만 들춰지는 대각선 모서리 기믹 */}
            <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none">
                {/* 칠판 배경색(#234733) */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[0px] border-t-transparent border-r-[0px] border-r-[#234733] z-20 transition-all duration-300 group-hover:border-t-[48px] group-hover:border-r-[48px]" />

                {/* 접혀 올라간 가상 그림자 레이어 */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[0px] border-b-black/15 border-l-[0px] border-l-transparent z-20 transition-all duration-300 group-hover:border-b-[48px] group-hover:border-l-[48px]" />
            </div>
        </BasePostIt>
    );
}