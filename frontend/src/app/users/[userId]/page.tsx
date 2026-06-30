"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardView from "@/components/dashboard/DashboardView";
import CommonButton from "@/components/button/CommonButton";
import dynamic from "next/dynamic";

function UserPostItsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.userId);

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  });

  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token, router]);

  if (!token || Number.isNaN(userId)) {
    return null;
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-1 md:p-6 select-none">
      <CommonButton
        onClick={() => {
          localStorage.removeItem("accessToken");
          setToken(null);
          router.push("/");
        }}
        text="← 로그아웃"
        className="
          relative w-full mb-4 justify-center text-center bg-white/80 hover:bg-white text-xs px-3 py-2.5 rounded-md shadow-sm text-slate-700 font-medium
          md:absolute md:top-4 md:left-4 md:w-auto md:mb-0 md:py-1.5
        "
      />

      <DashboardView token={token} mode="user" userId={userId} />
    </main>
  );
}

export default dynamic(() => Promise.resolve(UserPostItsPage), {
  ssr: false,
});
