"use client";

import { useRef } from "react";
import { PostIt } from "@/types";
import BasePostIt from "./BasePostIt";

type DashBoardPostItProps = {
    post: PostIt;
    colorClass?: string;
    // 런타임 안정성을 위해 Element 자체의 rect 정보를 넘겨받을 수 있도록 타입을 안전하게 가공합니다.
    onClick?: (rect: DOMRect, colorClass: string) => void;
};

export default function DashBoardPostIt({ post, colorClass = "", onClick }: DashBoardPostItProps) {
    // 실제 포스트잇의 DOM 위치를 정확하게 추적하기 위한 자체 Ref 생성
    const containerRef = useRef<HTMLDivElement>(null);

    // BasePostIt의 () => void 스펙을 완벽하게 맞추면서 내부 element를 안전하게 추출
    const handleBaseClick = () => {
        if (onClick && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            onClick(rect, colorClass);
        }
    };

    return (
        /* BasePostIt 바깥을 div로 감싸고 ref를 걸어 실제 물리적 돔 위치를 고정 확보합니다. */
        <div ref={containerRef} className="w-full h-full">
            <BasePostIt
                onClick={handleBaseClick}
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

                {/* 오른쪽 아래 호버 모서리 기믹 */}
                <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none">
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[0px] border-t-transparent border-r-[0px] border-r-[#234733] z-20 transition-all duration-300 group-hover:border-t-[48px] group-hover:border-r-[48px]" />
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[0px] border-b-black/15 border-l-[0px] border-l-transparent z-20 transition-all duration-300 group-hover:border-b-[48px] group-hover:border-l-[48px]" />
                </div>
            </BasePostIt>
        </div>
    );
}