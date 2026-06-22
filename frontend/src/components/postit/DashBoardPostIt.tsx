import { PostIt } from "@/types"
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
            className="w-full h-full flex flex-col justify-between transform transition-all duration-300 hover:scale-105"
        >
            {/* 콘텐츠 상단 영역 */}
            <div>
                <div className="text-sm font-bold opacity-70 mb-1">
                    {post.user_name || "Unknown"}'s Board
                </div>
                <div className="w-full h-[1px] bg-black/10 my-2" />
                {/* 추후 포스트잇 내부에 텍스트 내용물이나 투두 요약 개수가 표기될 공간입니다 */}
            </div>

            {/* 날짜 하단 영역 */}
            <div className="text-xs font-mono opacity-50 text-right">
                {post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
            </div>
        </BasePostIt>
    );
}