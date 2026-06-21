import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string) => void;
}

const MOCK_ACCOUNTS = [
  { name: "한준희", email: "wnswn@gmail.com", avatar: "HJ" },
  { name: "김민수", email: "minsu@gmail.com", avatar: "MS" },
  { name: "이영희", email: "younghee@gmail.com", avatar: "YH" }
];

export default function GoogleLoginModal({ isOpen, onClose, onSelectAccount }: GoogleLoginModalProps) {
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName && customEmail) {
      onSelectAccount(customEmail, customName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-300 transform scale-100 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6 border-b border-stone-100">
          <FcGoogle size={45} className="mb-3" />
          <h2 className="text-xl font-medium font-sans text-stone-800">계정 선택</h2>
          <p className="text-sm text-stone-500 mt-1">SKKU POST-IT으로 이동</p>
        </div>

        {/* Account Selector */}
        <div className="p-6 overflow-y-auto max-h-[300px]">
          {!showCustomForm ? (
            <div className="space-y-3">
              {MOCK_ACCOUNTS.map((acc, index) => (
                <button
                  key={index}
                  onClick={() => onSelectAccount(acc.email, acc.name)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-stone-50 rounded-lg border border-stone-100 hover:border-stone-200 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-600 text-sm group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                    {acc.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800 text-sm">{acc.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{acc.email}</p>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full flex items-center justify-center gap-2 p-3 hover:bg-stone-50 rounded-lg border border-dashed border-stone-300 hover:border-blue-400 text-stone-600 hover:text-blue-600 transition-all text-sm font-medium mt-4"
              >
                다른 계정 사용하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">이름</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">구글 이메일</label>
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-md hover:bg-stone-50 text-stone-600 text-sm font-medium transition-colors"
                >
                  이전으로
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  로그인
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Google Footer */}
        <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-t border-stone-100 text-xs text-stone-500">
          <span>한국어</span>
          <div className="flex gap-4">
            <button className="hover:underline" onClick={() => alert("도움말")}>도움말</button>
            <button className="hover:underline" onClick={() => alert("개인정보처리방침")}>개인정보</button>
            <button className="hover:underline" onClick={() => alert("약관")}>약관</button>
          </div>
        </div>
      </div>
    </div>
  );
}
