/**
 * interface 는 type 과 다르게 속성을 추가하여 가지는 것이 가능.
 * 확장성을 위해 type 이 아닌 interface 로 선언.
 */

import { PostIt } from "./postit";
import { Todo } from "./todo";

// 통합하여 export
export * from "./user";
export * from "./todo";
export * from "./postit";

/**
 * 백엔드 응답 규격
 */

// [GET] localhost:8000/post-its
export interface PostItsFetchResponse {
    success: boolean;
    "post-its": PostIt[]; // 🌟 기존 PostIt 모델을 재사용
    count: number;
    pageSize: number;
    pageNumber: number;
}

// [GET] localhost:8000/post-its/:postId
// [POST] localhost:8000/post-its/:postId
export interface TodoListResponse {
    success: boolean;
    todos: Todo[]; // 🌟 기존 Todo 모델을 재사용
}

// [DELETE] localhost:8000/post-its/:postId/todos/:todoId
export interface CommonMutationResponse {
    success: boolean;
    message: string;
}

// [PATCH] localhost:8000/post-its/:postId/todos/:todoId
export interface SingleTodoResponse {
    success: boolean;
    todos: Todo;
}

/**
 * 백엔드 요청 규격
 */

export interface GetPostItsQuery {
    filter: "mine" | null;
    page: number;
}

export interface PostItPathParams {
    postId: number;
}

export interface TodoPathParams {
    postId: number;
    todoId: number;
}

export interface CreateTodoRequest {
    content: string;
    due_date: string | null;
}

export interface CompleteTodoRequest {
    isCompleted: boolean;
}