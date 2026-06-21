export interface PostIt {
    id: number;
    created_at: string;
    user_id: number;
    user_name: string;
}

// 다대다 관계 매핑 스펙이 필요할 때 사용
export interface PostItTodo {
    post_it_id: number;
    todo_id: number;
}