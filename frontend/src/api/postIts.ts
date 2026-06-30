import { CommonMutationResponse, CreateTodoRequest, PostIt, PostItPathParams, PostItsFetchResponse, SingleTodoResponse, TodoListResponse, TodoPathParams, UpdateTodoRequest } from "@/types";
import { apiFetch } from "./client";

export const getPostIts = async (
    token: string,
    queryParams: { filter: "all" | "mine"; page: number } // 컴포넌트가 주는 타입을 인자로 수용
): Promise<PostItsFetchResponse> => {
    const { filter, page } = queryParams;

    // 백엔드 명세 변환 로직: "all"이면 파라미터를 보내지 않고, "mine"일 때만 "mine"을 전송
    const backendFilter = filter === "mine" ? "mine" : undefined;

    // URLSearchParams를 활용하면 undefined인 값은 주소창에서 자동으로 제외
    const query = new URLSearchParams({
        page: String(page),
        ...(backendFilter && { filter: backendFilter }) // backendFilter가 있을 때만 객체에 병합
    }).toString();

    return apiFetch(`/post-its?${query}`, {
        method: "GET",
        token,
    });
};

export const fetchAllPostIts = async (
    token: string,
    filter: "all" | "mine"
): Promise<PostIt[]> => {
    const all: PostIt[] = [];
    let page = 1;
    let totalCount = Infinity;

    while (all.length < totalCount) {
        const data = await getPostIts(token, { filter, page });
        if (!data.success) break;

        const items = data["post-its"] || [];
        all.push(...items);
        totalCount = data.count;

        if (items.length === 0) break;
        page++;
    }

    return all;
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

export const updateTodo = async (
    token: string,
    params: TodoPathParams,
    body: UpdateTodoRequest
): Promise<SingleTodoResponse> => {
    return apiFetch(`/post-its/${params.postId}/todos/${params.todoId}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(body),
    });
};