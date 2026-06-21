// app/page.tsx
"use client";

import GoogleButton from "@/components/button/GoogleButton";

export default function Home() {
  const handleGoogleLogin = () => {
    // .env.local에 저장한 백엔드 API URL을 불러와 통신합니다.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log("백엔드와 통신을 시작합니다:", backendUrl);


    // 예시: 백엔드의 구글 인증 엔드포인트로 이동
    // window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    // 배경: 연한 누룽지색 (#EEDCB3)
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-4 relative overflow-hidden">

      {/* 대형 포스트잇 오브젝트 (Hover 그룹) */}
      <div className="group relative w-80 h-80 bg-yellow-100 border border-yellow-200 shadow-md p-6 flex flex-col justify-between transition-all duration-300">

        {/* 우측 하단 접히는 모서리와 구글 버튼 인터랙션 */}
        <div className="absolute bottom-0 right-0 w-24 h-24 overflow-hidden">

          {/* 접혀 올라가는 모서리 그림자 및 배경용 삼각형 */}
          <div className="absolute bottom-0 right-0 w-0 h-0 
            border-t-[96px] border-t-transparent 
            border-r-[96px] border-r-white/40 
            z-20 pointer-events-none 
            origin-bottom-right transition-all duration-500
            group-hover:border-t-[0px] group-hover:border-r-[0px]"
          />

          {/* 실제 들리는 종이 뒷면 느낌의 삼각형 효과 */}
          <div className="absolute bottom-0 right-0 w-0 h-0 
            border-b-[0px] border-b-amber-200
            border-l-[0px] border-l-transparent
            z-10 shadow-sm transition-all duration-500
            group-hover:border-b-[96px] group-hover:border-l-[96px]"
          />

          {/* 마우스 올렸을 때 노출되는 구글 로그인 버튼 배치 구역 */}
          <div className="absolute bottom-3 right-3 z-30 opacity-0 scale-75 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:scale-100">
            <GoogleButton onClick={handleGoogleLogin} />
          </div>
        </div>

      </div>

    </main>
  );
}