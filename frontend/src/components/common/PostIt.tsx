import React from "react";

export type PostItColor = "yellow" | "pink" | "blue" | "green" | "purple";

export interface PreviewTodo {
  text: string;
  completed: boolean;
}

interface PostItProps {
  id?: string;
  title: string;
  date?: string;
  isMain?: boolean;
  onClick?: () => void;
  color?: PostItColor;
  previewTodos?: PreviewTodo[];
}

const COLOR_MAP = {
  yellow: {
    bg: "#fef08a",      // yellow-200
    fold: "#fde047",    // yellow-300
    text: "#78350f"     // amber-900
  },
  pink: {
    bg: "#fbcfe8",      // pink-200
    fold: "#f9a8d4",    // pink-300
    text: "#831843"     // pink-900
  },
  blue: {
    bg: "#bfdbfe",      // blue-200
    fold: "#93c5fd",    // blue-300
    text: "#1e3a8a"     // blue-900
  },
  green: {
    bg: "#bbf7d0",      // green-200
    fold: "#86efac",    // green-300
    text: "#064e3b"     // green-900
  },
  purple: {
    bg: "#e9d5ff",      // purple-200
    fold: "#d8b4fe",    // purple-300
    text: "#581c87"     // purple-900
  }
};

// Deterministic rotation based on title string
const getRotation = (title: string) => {
  if (!title) return 0;
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Returns rotation between -2.5 and +2.5 degrees
  const angle = (hash % 5) * 1.25;
  return angle;
};

export default function PostIt({
  id = "",
  title,
  date,
  isMain = false,
  onClick,
  color = "yellow",
  previewTodos = []
}: PostItProps) {
  const colorInfo = COLOR_MAP[color] || COLOR_MAP.yellow;
  const rotation = isMain ? 0 : getRotation(title + id);

  const style = {
    "--postit-bg": colorInfo.bg,
    "--postit-fold": colorInfo.fold,
    "--postit-text": colorInfo.text,
    transform: isMain ? "none" : `rotate(${rotation}deg)`
  } as React.CSSProperties;

  return (
    <div
      onClick={!isMain ? onClick : undefined}
      style={style}
      className={`
        group
        post-it-card
        ${isMain ? "post-it-main w-72 h-72 p-6 flex flex-col justify-between" : "post-it-board w-full h-full p-4 flex flex-col justify-between"}
        handwriting
        rounded-sm
      `}
    >
      {/* 3D Fold Corner - Only for board post-its */}
      {!isMain && <div className="fold-flap" />}

      {/* Header */}
      <div className="w-full text-center border-b border-black/10 pb-1">
        <h3 className={`font-bold ${isMain ? "text-3xl mt-4" : "text-lg"} leading-tight tracking-wide truncate`}>
          {title}
        </h3>
      </div>

      {/* Body Content */}
      <div className="flex-1 flex flex-col justify-center py-2 relative overflow-hidden">
        {isMain ? (
          <div className="text-center px-2 flex flex-col items-center justify-center gap-6 mt-4">
            <p className="text-lg text-black/60 font-semibold leading-relaxed">
              💡 TAP TO PEEL
            </p>
            <div className="w-full flex justify-center py-1">
              <span className="text-sm border border-dashed border-black/35 rounded-full px-3 py-1 text-black/55 animate-pulse font-bold">
                HOVER TO OPEN
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-start">
            {previewTodos && previewTodos.length > 0 ? (
              <div className="mt-1 space-y-1 text-left text-xs font-semibold leading-relaxed overflow-hidden">
                {previewTodos.slice(0, 3).map((todo, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span className={`w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center border border-black/30 rounded-sm bg-white/40 text-[9px] font-bold`}>
                      {todo.completed ? "✓" : ""}
                    </span>
                    <span className={`truncate ${todo.completed ? "line-through opacity-40 font-normal" : "opacity-80"}`}>
                      {todo.text}
                    </span>
                  </div>
                ))}
                {previewTodos.length > 3 && (
                  <div className="text-[10px] text-black/40 text-right mt-1">
                    +{previewTodos.length - 3}개 더보기
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs opacity-40 font-semibold italic">
                할일이 없습니다
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative h-6 w-full flex items-end">
        {!isMain && date && (
          <div 
            className={`
              text-[11px] font-mono opacity-60 font-semibold
              transition-opacity duration-300 ease-out
              group-hover:opacity-0
              pb-1
            `}
          >
            {date}
          </div>
        )}
      </div>
    </div>
  );
}
