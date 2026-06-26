import { Todo } from "@/types";

type MobileMetadataProps = {
  todo: Todo;
  isCompleted: boolean;
};

export default function MobileMetadata({ todo, isCompleted }: MobileMetadataProps) {
  return (
    <div className="bg-white/90 border border-slate-200 rounded-xl p-3 shadow-inner grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-600">
      <div>
        <span className="font-bold text-slate-500">⏱️ 경과일:</span>{" "}
        <span className="font-mono">{todo.elapsed_date !== null ? `${todo.elapsed_date}일` : "—"}</span>
      </div>
      <div>
        <span className="font-bold text-slate-500">📅 생성일:</span>{" "}
        <span className="font-mono">{todo.created_at ? new Date(todo.created_at).toLocaleDateString() : "—"}</span>
      </div>
      <div>
        <span className="font-bold text-slate-500">⏳ 소요기간:</span>{" "}
        <span className="font-mono">{todo.duration != null ? `${todo.duration}일` : "—"}</span>
      </div>
      <div>
        <span className="font-bold text-slate-500">🏁 마감기한:</span>{" "}
        <span className="font-mono">{todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "—"}</span>
      </div>
      {isCompleted && todo.completed_at && (
        <div className="col-span-2 border-t border-slate-100 pt-2 mt-1 text-green-600 font-semibold">
          <span>✅ 완료일시:</span>{" "}
          <span className="font-mono text-xs">{new Date(todo.completed_at).toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}