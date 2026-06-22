// src/hooks/useGoogleSignIn.ts
import { useEffect, RefObject } from "react";
import { loginWithGoogle } from "@/api/auth";

interface UseGoogleSignInProps {
    token: string | null;
    setToken: (token: string | null) => void;
    buttonRef: RefObject<HTMLDivElement | null>;
}

export const useGoogleSignIn = ({ token, setToken, buttonRef }: UseGoogleSignInProps) => {
    const handleCredentialResponse = async (response: any) => {
        console.log("구글 ID 토큰 획득 성공. 백엔드로 검증 요청을 보냅니다.");
        try {
            const jwtToken = await loginWithGoogle(response.credential);
            setToken(jwtToken);
            console.log("실제 백엔드 JWT 발급 및 인증 완료.");
        } catch (error) {
            console.error("인증 연동 중 에러 발생:", error);
            alert("백엔드 API와의 실연동에 실패했습니다. 서버 상태를 확인하세요.");
        }
    };

    const initializeGoogleSignIn = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.error("환경변수 파일(.env)에 NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
            return;
        }

        if ((window as any).google?.accounts?.id) {
            (window as any).google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse,
                ux_mode: "popup",
                context: "signin",
            });

            if (buttonRef.current) {
                (window as any).google.accounts.id.renderButton(buttonRef.current, {
                    theme: "outline",
                    size: "large",
                    shape: "circle",
                    type: "icon",
                });
            }
        }
    };

    useEffect(() => {
        (window as any).handleCredentialResponse = handleCredentialResponse;
        if ((window as any).google) {
            initializeGoogleSignIn();
        }
        return () => {
            delete (window as any).handleCredentialResponse;
        };
    }, [token]);

    return { initializeGoogleSignIn };
};