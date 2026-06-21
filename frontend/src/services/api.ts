// API Service with Automatic Local Storage Fallback

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Todo {
  id: string;
  postItId: string;
  text: string;
  completed: boolean;
}

export interface PostItData {
  id: string;
  title: string;
  date: string;
  color: "yellow" | "pink" | "blue" | "green" | "purple";
  ownerEmail: string;
}

const BACKEND_URL = "http://localhost:8000";

// Mock Database Initial State
const DEFAULT_POSTITS: PostItData[] = [
  { id: "1", title: "한준희의 포스트잇", date: "2026-06-18", color: "yellow", ownerEmail: "wnswn@gmail.com" },
  { id: "2", title: "김민수의 포스트잇", date: "2026-06-19", color: "pink", ownerEmail: "minsu@gmail.com" },
  { id: "3", title: "이영희의 포스트잇", date: "2026-06-20", color: "blue", ownerEmail: "younghee@gmail.com" },
  { id: "4", title: "박민아의 포스트잇", date: "2026-06-20", color: "green", ownerEmail: "mina@gmail.com" },
  { id: "5", title: "정수현의 포스트잇", date: "2026-06-21", color: "purple", ownerEmail: "suhyun@gmail.com" },
  { id: "6", title: "최현우의 포스트잇", date: "2026-06-21", color: "yellow", ownerEmail: "hw@gmail.com" },
  { id: "7", title: "강태호의 포스트잇", date: "2026-06-21", color: "pink", ownerEmail: "taeho@gmail.com" },
  { id: "8", title: "윤지혜의 포스트잇", date: "2026-06-21", color: "blue", ownerEmail: "jihye@gmail.com" }
];

const DEFAULT_TODOS: Todo[] = [
  { id: "t1", postItId: "1", text: "Next.js 공부하기", completed: true },
  { id: "t2", postItId: "1", text: "Tailwind CSS v4 마스터하기", completed: false },
  { id: "t3", postItId: "1", text: "미니 프로젝트 완성하기", completed: false },
  
  { id: "t4", postItId: "2", text: "중간고사 준비하기", completed: true },
  { id: "t5", postItId: "2", text: "매일 헬스장 가기", completed: false },
  
  { id: "t6", postItId: "3", text: "알고리즘 문제 풀기", completed: true },
  { id: "t7", postItId: "3", text: "방 대청소하기", completed: true },
  { id: "t8", postItId: "3", text: "마트에서 장보기", completed: false },
  
  { id: "t9", postItId: "4", text: "리액트 공식 문서 다 읽기", completed: false },
  
  { id: "t10", postItId: "5", text: "인턴십 지원서 초안 작성", completed: false },
  { id: "t11", postItId: "5", text: "깃허브 잔디 3일연속 심기", completed: true },
  
  { id: "t12", postItId: "6", text: "프로젝트 기획안 발표 준비", completed: true },
  
  { id: "t13", postItId: "7", text: "주말 가족 식사 예약하기", completed: false },
  
  { id: "t14", postItId: "8", text: "베스트셀러 소설 완독", completed: false }
];

// Helper to interact with LocalStorage
const getStoredData = () => {
  if (typeof window === "undefined") return { postIts: DEFAULT_POSTITS, todos: DEFAULT_TODOS };
  const stored = localStorage.getItem("skku_postit_store");
  if (!stored) {
    const initial = { postIts: DEFAULT_POSTITS, todos: DEFAULT_TODOS };
    localStorage.setItem("skku_postit_store", JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored) as { postIts: PostItData[]; todos: Todo[] };
};

const setStoredData = (data: { postIts: PostItData[]; todos: Todo[] }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("skku_postit_store", JSON.stringify(data));
  }
};

// Check if we should use the backend or mock
let useMock = true;

const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${BACKEND_URL}/`, { method: "GET" });
    const text = await res.text();
    // If the server returns something other than "OK", or fails, we fall back.
    // Wait, the starter app.js returns "OK" at "/", but we don't have endpoints yet.
    // So let's check if the server is alive. If the server is alive AND has implemented endpoints,
    // we can attempt backend calls, but if any call throws JSON parse errors, we fallback.
    return res.ok && text === "OK";
  } catch {
    return false;
  }
};

export const apiService = {
  // Check backend and initialize
  async init() {
    const isAlive = await checkBackendConnection();
    // We default to local storage mock because backend is a skeleton. 
    // But we write fetch code so it works when actual endpoints are coded.
    useMock = !isAlive;
    console.log(`API Service initialized. Using Mock: ${useMock}`);
  },

  // Auth Operations
  async loginWithGoogle(email: string, name: string): Promise<User> {
    const mockUser: User = {
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`
    };

    if (useMock) {
      if (typeof window !== "undefined") {
        localStorage.setItem("skku_postit_user", JSON.stringify(mockUser));
      }
      return mockUser;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("skku_postit_user", JSON.stringify(data.user));
        localStorage.setItem("skku_postit_token", data.token);
      }
      return data.user;
    } catch (e) {
      console.warn("Backend auth failed, falling back to mock", e);
      if (typeof window !== "undefined") {
        localStorage.setItem("skku_postit_user", JSON.stringify(mockUser));
      }
      return mockUser;
    }
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skku_postit_user");
      localStorage.removeItem("skku_postit_token");
    }
    if (!useMock) {
      try {
        await fetch(`${BACKEND_URL}/auth/logout`, { method: "POST" });
      } catch (e) {
        console.warn("Backend logout failed", e);
      }
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("skku_postit_user");
    return stored ? JSON.parse(stored) : null;
  },

  // Post-It Operations
  async getPostIts(): Promise<PostItData[]> {
    if (useMock) {
      return getStoredData().postIts;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/posts`);
      return await res.json();
    } catch (e) {
      console.warn("Backend getPostIts failed, falling back to localStorage", e);
      return getStoredData().postIts;
    }
  },

  async createPostIt(title: string, color: "yellow" | "pink" | "blue" | "green" | "purple"): Promise<PostItData> {
    const user = this.getCurrentUser();
    const email = user?.email || "anonymous@gmail.com";
    const newPostIt: PostItData = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      date: new Date().toISOString().split("T")[0],
      color,
      ownerEmail: email
    };

    if (useMock) {
      const data = getStoredData();
      data.postIts.unshift(newPostIt); // Add to the beginning
      setStoredData(data);
      return newPostIt;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPostIt)
      });
      return await res.json();
    } catch (e) {
      console.warn("Backend createPostIt failed, falling back to localStorage", e);
      const data = getStoredData();
      data.postIts.unshift(newPostIt);
      setStoredData(data);
      return newPostIt;
    }
  },

  async deletePostIt(id: string): Promise<void> {
    if (useMock) {
      const data = getStoredData();
      data.postIts = data.postIts.filter(p => p.id !== id);
      data.todos = data.todos.filter(t => t.postItId !== id);
      setStoredData(data);
      return;
    }

    try {
      await fetch(`${BACKEND_URL}/api/posts/${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Backend deletePostIt failed, falling back to localStorage", e);
      const data = getStoredData();
      data.postIts = data.postIts.filter(p => p.id !== id);
      data.todos = data.todos.filter(t => t.postItId !== id);
      setStoredData(data);
    }
  },

  // Todo Operations
  async getTodos(postItId: string): Promise<Todo[]> {
    if (useMock) {
      return getStoredData().todos.filter(t => t.postItId === postItId);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/${postItId}/todos`);
      return await res.json();
    } catch (e) {
      console.warn("Backend getTodos failed, falling back to localStorage", e);
      return getStoredData().todos.filter(t => t.postItId === postItId);
    }
  },

  async createTodo(postItId: string, text: string): Promise<Todo> {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 9),
      postItId,
      text,
      completed: false
    };

    if (useMock) {
      const data = getStoredData();
      data.todos.push(newTodo);
      setStoredData(data);
      return newTodo;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/${postItId}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo)
      });
      return await res.json();
    } catch (e) {
      console.warn("Backend createTodo failed, falling back to localStorage", e);
      const data = getStoredData();
      data.todos.push(newTodo);
      setStoredData(data);
      return newTodo;
    }
  },

  async toggleTodo(todoId: string): Promise<Todo> {
    if (useMock) {
      const data = getStoredData();
      const todo = data.todos.find(t => t.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
        setStoredData(data);
        return todo;
      }
      throw new Error("Todo not found");
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/todos/${todoId}/toggle`, {
        method: "PUT"
      });
      return await res.json();
    } catch (e) {
      console.warn("Backend toggleTodo failed, falling back to localStorage", e);
      const data = getStoredData();
      const todo = data.todos.find(t => t.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
        setStoredData(data);
        return todo;
      }
      throw new Error("Todo not found");
    }
  },

  async deleteTodo(todoId: string): Promise<void> {
    if (useMock) {
      const data = getStoredData();
      data.todos = data.todos.filter(t => t.id !== todoId);
      setStoredData(data);
      return;
    }

    try {
      await fetch(`${BACKEND_URL}/api/todos/${todoId}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Backend deleteTodo failed, falling back to localStorage", e);
      const data = getStoredData();
      data.todos = data.todos.filter(t => t.id !== todoId);
      setStoredData(data);
    }
  }
};
