"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PaginationButton from "@/components/button/PaginationButton";
import { POSTIT_COLORS } from "@/constants/colors";
import { PostIt, DashboardMode } from "@/types";
import FilterButton from "@/components/button/FilterButton";
import { usePostItDashboard } from "@/hooks/usePostItDashboard";
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
import UserButtonBar from "@/components/dashboard/UserButtonBar";

type DashboardViewProps = {
    token: string;
    mode: DashboardMode;
    userId?: number;
    filter?: "all" | "mine";
    onFilterChange?: () => void;
};

function getTitleText(mode: DashboardMode, filter: "all" | "mine" | undefined, userName?: string): string {
    if (mode === "user" && userName) {
        return `${userName}의 포스트잇`;
    }
    if (mode === "mine" || filter === "mine") {
        return "내 포스트잇";
    }
    return "모두의 포스트잇";
}

export default function DashboardView({
    token,
    mode,
    userId,
    filter = "all",
    onFilterChange,
}: DashboardViewProps) {
    const blackboardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [zoomedPostIt, setZoomedPostIt] = useState<{
        colorClass: string;
        style: React.CSSProperties;
    } | null>(null);

    const dashboardMode = mode === "user" ? "user" : filter;
    const {
        postIts,
        users,
        currentPage,
        setCurrentPage,
        totalPages,
        isLoading,
        userName,
    } = usePostItDashboard({
        token,
        mode: dashboardMode,
        userId,
    });

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

    const showFilterButton = mode !== "user" && onFilterChange;
    const showUserButtons = mode !== "mine" && filter !== "mine";

    return (
        <>
            <ZoomedPostItOverlay data={zoomedPostIt} />

            <ChalkboardFrame ref={blackboardRef}>
                <Title className="h-auto flex flex-col gap-2 border-b border-green-700 pb-2">
                    <span className="text-white font-bold text-xl md:text-2xl tracking-wide">
                        ✏️ {getTitleText(mode, filter, userName)}
                    </span>
                    {showUserButtons && <UserButtonBar users={users} />}
                </Title>

                <ChalkboardContent>
                    <GridPostIt>
                        {isLoading ? (
                            <Notice className="text-green-300 text-sm font-bold col-span-4 flex items-center justify-center animate-pulse min-w-full">
                                백엔드 통신 중...
                            </Notice>
                        ) : postIts.length > 0 ? (
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
                            <Notice className="text-green-200/40 text-sm font-bold col-span-4 flex items-center justify-center min-w-full">
                                조회된 포스트잇이 없습니다
                            </Notice>
                        )}
                    </GridPostIt>

                    <SideController>
                        <PaginationFrame>
                            <PaginationButton
                                direction="up"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            />
                            <PaginationNotice>
                                <p className="text-xs text-green-300 font-semibold uppercase">Page</p>
                                <p className="text-2xl font-black text-white tracking-widest mt-0.5">
                                    {currentPage}{" "}
                                    <span className="text-sm font-normal text-green-400">/</span>{" "}
                                    {totalPages}
                                </p>
                            </PaginationNotice>
                            <PaginationButton
                                direction="down"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationFrame>

                        {showFilterButton && (
                            <FilterButton
                                onClick={onFilterChange}
                                variant={filter === "mine" ? "active" : "default"}
                                text={filter === "all" ? "내 포스트잇 보기" : "모두의 포스트잇 보기"}
                            />
                        )}
                    </SideController>
                </ChalkboardContent>
            </ChalkboardFrame>
        </>
    );
}
