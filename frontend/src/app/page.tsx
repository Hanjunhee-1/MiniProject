"use client";

import { useState, useRef } from "react";
import Script from "next/script";
import MainPostIt from "@/components/postit/MainPostIt";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import DashboardView from "@/components/dashboard/DashboardView";
import CommonButton from "@/components/button/CommonButton";
import dynamic from "next/dynamic";

function Home() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  });
  const [filter, setFilter] = useState<"all" | "mine">("all");

  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const { initializeGoogleSignIn } = useGoogleSignIn({
    token,
    setToken,
    buttonRef: googleBtnContainerRef,
  });

  const handleFilterChange = () => {
    setFilter((prev) => (prev === "all" ? "mine" : "all"));
  };

  if (!token) {
    return (
      <>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={initializeGoogleSignIn}
        />
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-4 select-none">
          <MainPostIt ref={googleBtnContainerRef} />
        </main>
      </>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EEDCB3] p-1 md:p-6 select-none">
      <CommonButton
        onClick={() => {
          localStorage.removeItem("accessToken");
          setToken(null);
        }}
        text="← 로그아웃"
        className="
          relative w-full mb-4 justify-center text-center bg-white/80 hover:bg-white text-xs px-3 py-2.5 rounded-md shadow-sm text-slate-700 font-medium
          md:absolute md:top-4 md:left-4 md:w-auto md:mb-0 md:py-1.5
        "
      />

      <DashboardView
        token={token}
        mode={filter}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
    </main>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
