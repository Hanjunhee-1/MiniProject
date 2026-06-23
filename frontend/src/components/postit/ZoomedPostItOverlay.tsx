// src/components/postit/ZoomedPostItOverlay.tsx
import React from "react";
import PostItContent from "./PostItContent";
import Title from "../common/Title";
import Notice from "../common/Notice";

// 💡 메인 페이지의 zoomedPostIt 상태 타입을 그대로 정의해줍니다.
interface ZoomedPostItData {
    colorClass: string;
    style: React.CSSProperties;
}

interface ZoomedPostItOverlayProps {
    data: ZoomedPostItData | null; // 데이터가 없을 때는 null이 들어올 수 있도록 처리
}

export default function ZoomedPostItOverlay({ data }: ZoomedPostItOverlayProps) {
    // 데이터가 없으면 화면에 아무것도 그리지 않습니다 (Early Return)
    if (!data) return null;

    return (
        <>
            {/* 어두운 배경 오버레이 */}
            <div className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-500" />

            {/* 확대되는 포스트잇 카드 */}

            <PostItContent className={`shadow-2xl flex flex-col justify-between p-8 z-50 text-slate-800 ${data.colorClass}`}
                style={data.style}
            >
                <div className="w-full flex flex-col h-full">
                    <Title className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-800 tracking-wide">
                            📌 Task Board
                        </h2>
                    </Title>
                    <p className="text-xs text-slate-500 mt-1">포스트잇 고유 식별코드: 연동 중...</p>
                    <div className="w-full h-[1px] bg-slate-800/10 my-4" />

                    {/* 로딩 인디케이터 구역 */}
                    <Notice className="flex-1 border border-dashed border-slate-400/40 rounded bg-white/30 flex items-center justify-center">
                        <p className="text-sm font-semibold text-slate-500/80 animate-pulse">
                            할 일 목록 리스트를 불러오고 있습니다...
                        </p>
                    </Notice>
                </div>
            </PostItContent>
        </>
    );
}