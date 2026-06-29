// src/api/client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = "/api";

interface CustomOptions extends RequestInit {
    token?: string | null;
}

export const apiFetch = async (endpoint: string, options: CustomOptions = {}) => {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    // 🌟 토큰이 제공된 경우 Authorization 헤더에 자동으로 Bearer 토큰 주입
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${API_PREFIX}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!res.ok) {
        throw new Error(`API 통신 에러 상태코드: ${res.status}`);
    }

    return res.json();
};