// src/api/auth.ts
import { apiFetch } from "./client";

// 백엔드 응답 인터페이스 정의
interface AuthResponse {
    success: boolean;
    token: string;
}

/**
 * 구글 ID 토큰을 백엔드 서버에 전달하여 자체 JWT 토큰을 발급받습니다.
 * @param googleToken 구글로부터 인증 성공 후 받은 credential 토큰
 * @returns 발급 완료된 서비스 자체 JWT 토큰 string
 */
export const loginWithGoogle = async (googleToken: string): Promise<string> => {
    const data: AuthResponse = await apiFetch("/auth", {
        method: "POST",
        body: JSON.stringify({ token: googleToken }),
    });

    // success가 false이거나 토큰이 누락된 경우 방어 조치
    if (!data.success || !data.token) {
        throw new Error("백엔드 인증에 실패했거나 토큰이 올바르게 발급되지 않았습니다.");
    }

    return data.token;
};