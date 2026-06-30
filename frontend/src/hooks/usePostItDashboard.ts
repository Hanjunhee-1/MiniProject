"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAllPostIts } from "@/api/postIts";
import { getMe } from "@/api/auth";
import { DISPLAY_PAGE_SIZE } from "@/constants/size";
import { DashboardMode, DashboardUser, PostIt } from "@/types";

type UsePostItDashboardParams = {
    token: string | null;
    mode: DashboardMode;
    userId?: number;
};

function extractUniqueUsers(postIts: PostIt[]): DashboardUser[] {
    const userMap = new Map<number, string>();
    for (const post of postIts) {
        if (!userMap.has(post.user_id)) {
            userMap.set(post.user_id, post.user_name || "Unknown");
        }
    }
    return Array.from(userMap.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

function applyClientFilter(
    postIts: PostIt[],
    mode: DashboardMode,
    userId: number | undefined,
    currentUserId: number | null
): PostIt[] {
    if (mode === "user" && userId !== undefined) {
        return postIts.filter((post) => post.user_id === userId);
    }
    if (mode === "mine" && currentUserId !== null) {
        return postIts.filter((post) => post.user_id === currentUserId);
    }
    return postIts;
}

export function usePostItDashboard({ token, mode, userId }: UsePostItDashboardParams) {
    const [allPostIts, setAllPostIts] = useState<PostIt[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [mode, userId, token]);

    useEffect(() => {
        if (!token) return;

        const fetchCurrentUser = async () => {
            try {
                const data = await getMe(token);
                if (data.success && data.user) {
                    setCurrentUserId(data.user.id);
                }
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
            }
        };

        fetchCurrentUser();
    }, [token]);

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const apiFilter = mode === "mine" ? "mine" : "all";
                const fetched = await fetchAllPostIts(token, apiFilter);
                setAllPostIts(fetched);
            } catch (error) {
                console.error("포스트잇 목록 로드 실패:", error);
                setAllPostIts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token, mode]);

    const usersForButtons = useMemo(() => {
        if (mode === "mine") return [];
        return extractUniqueUsers(allPostIts);
    }, [allPostIts, mode]);

    const filteredPostIts = useMemo(
        () => applyClientFilter(allPostIts, mode, userId, currentUserId),
        [allPostIts, mode, userId, currentUserId]
    );

    const totalPages = Math.max(1, Math.ceil(filteredPostIts.length / DISPLAY_PAGE_SIZE));

    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * DISPLAY_PAGE_SIZE;
        return filteredPostIts.slice(start, start + DISPLAY_PAGE_SIZE);
    }, [filteredPostIts, currentPage]);

    const userName = useMemo(() => {
        if (mode !== "user" || userId === undefined) return undefined;
        return usersForButtons.find((user) => user.id === userId)?.name
            ?? filteredPostIts[0]?.user_name
            ?? "Unknown";
    }, [mode, userId, usersForButtons, filteredPostIts]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return {
        postIts: pageItems,
        users: usersForButtons,
        currentPage,
        setCurrentPage,
        totalPages,
        isLoading,
        userName,
    };
}
