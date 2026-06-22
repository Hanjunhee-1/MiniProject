import { CommonMutationResponse, CreateTodoRequest, GetPostItsQuery, PostItPathParams, PostItsFetchResponse, SingleTodoResponse, TodoListResponse, TodoPathParams } from "@/types";
import { apiFetch } from "./client";

export const getPostIts = async (
    token: string,
    queryParams: GetPostItsQuery
): Promise<PostItsFetchResponse> => {
    const { filter, page } = queryParams;
    return apiFetch(`/post-its?filter=${filter}&page=${page}`, {
        method: "GET",
        token,
    });
};

export const getTodosByPostItId = async (
    token: string,
    params: PostItPathParams
): Promise<TodoListResponse> => {
    return apiFetch(`/post-its/${params.postId}`, {
        method: "GET",
        token,
    });
};

export const createTodo = async (
    token: string,
    params: PostItPathParams,
    body: CreateTodoRequest
): Promise<SingleTodoResponse> => {
    return apiFetch(`/post-its/${params.postId}`, {
        method: "POST",
        token,
        body: JSON.stringify(body),
    });
};

export const deleteTodo = async (
    token: string,
    params: TodoPathParams
): Promise<CommonMutationResponse> => {
    return apiFetch(`/post-its/${params.postId}/todos/${params.todoId}`, {
        method: "DELETE",
        token,
    });
};

export const completeTodo = async (
    token: string,
    params: TodoPathParams
): Promise<SingleTodoResponse> => {
    return apiFetch(`/post-its/${params.postId}/todos/${params.todoId}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ isCompleted: true }),
    });
};