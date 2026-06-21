export interface Todo {
    id: number;
    content: string;
    created_at: string;          // 백엔드 날짜는 문자열(ISO형식 등)로 수신됨
    completed_at: string | null; // 완료 전에는 null일 수 있음
    duration: number | null;
    due_date: string | null;
    elapsed_date: number | null;
    post_it_id: number;
}