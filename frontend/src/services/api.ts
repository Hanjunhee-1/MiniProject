// API Service connected to backend at http://localhost:8000 with LocalStorage mock fallback

export interface User {
  id: string;
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
  ownerId: string;
  ownerName: string;
}

const BACKEND_URL = "http://localhost:8000";

// --- JWT Decoder Helper ---
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decoding failed", e);
    return null;
  }
}

// --- MOCK DATABASE (Fallback when backend is not running) ---
const DEFAULT_POSTITS: PostItData[] = [
  { id: "1", title: "한준희의 포스트잇", date: "2026-06-18", color: "yellow", ownerId: "101", ownerName: "한준희" },
  { id: "2", title: "김민수의 포스트잇", date: "2026-06-19", color: "pink", ownerId: "102", ownerName: "김민수" },
  { id: "3", title: "이영희의 포스트잇", date: "2026-06-20", color: "blue", ownerId: "103", ownerName: "이영희" },
  { id: "4", title: "박민아의 포스트잇", date: "2026-06-20", color: "green", ownerId: "104", ownerName: "박민아" },
  { id: "5", title: "정수현의 포스트잇", date: "2026-06-21", color: "purple", ownerId: "105", ownerName: "정수현" },
  { id: "6", title: "최현우의 포스트잇", date: "2026-06-21", color: "yellow", ownerId: "106", ownerName: "최현우" },
  { id: "7", title: "강태호의 포스트잇", date: "2026-06-21", color: "pink", ownerId: "107", ownerName: "강태호" },
  { id: "8", title: "윤지혜의 포스트잇", date: "2026-06-21", color: "blue", ownerId: "108", ownerName: "윤지혜" }
];

const DEFAULT_TODOS: Todo[] = [
  { id: "1", postItId: "1", text: "Next.js 공부하기", completed: true },
  { id: "2", postItId: "1", text: "Tailwind CSS v4 마스터하기", completed: false },
  { id: "3", postItId: "1", text: "미니 프로젝트 완성하기", completed: false },
  { id: "4", postItId: "2", text: "중간고사 준비하기", completed: true },
  { id: "5", postItId: "2", text: "매일 헬스장 가기", completed: false },
  { id: "6", postItId: "3", text: "알고리즘 문제 풀기", completed: true },
  { id: "7", postItId: "3", text: "방 대청소하기", completed: true },
  { id: "8", postItId: "3", text: "마트에서 장보기", completed: false },
  { id: "9", postItId: "4", text: "리액트 공식 문서 다 읽기", completed: false },
  { id: "10", postItId: "5", text: "인턴십 지원서 초안 작성", completed: false },
  { id: "11", postItId: "5", text: "깃허브 잔디 3일연속 심기", completed: true },
  { id: "12", postItId: "6", text: "프로젝트 기획안 발표 준비", completed: true },
  { id: "13", postItId: "7", text: "주말 가족 식사 예약하기", completed: false },
  { id: "14", postItId: "8", text: "베스트셀러 소설 완독", completed: false }
];

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

const POSTIT_COLORS: ("yellow" | "pink" | "blue" | "green" | "purple")[] = ["yellow", "pink", "blue", "green", "purple"];
const getColorForId = (id: any) => {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 0;
  return POSTIT_COLORS[numericId % POSTIT_COLORS.length];
};

// State flag to detect if backend is active. Will be set in init()
let backendActive = false;

export const apiService = {
  // Check backend connection
  async init() {
    try {
      const res = await fetch(`${BACKEND_URL}/`, { method: "GET" });
      const text = await res.text();
      // Server returned OK, indicating backend server is online
      backendActive = res.ok && text.includes("Google Login Test");
      console.log(`[API Service] Connected to backend: ${backendActive}`);
    } catch (e) {
      console.warn("[API Service] Backend server offline. Falling back to local storage mock.");
      backendActive = false;
    }
  },

  // Auth Operations
  async loginWithGoogle(idToken: string): Promise<{ user: User; token: string }> {
    if (!backendActive) {
      // Mock login fallback
      const mockUser: User = {
        id: "101",
        name: "한준희",
        email: "wnswn@gmail.com",
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=한준희`
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("skku_postit_user", JSON.stringify(mockUser));
        localStorage.setItem("skku_postit_token", "mock_jwt_token_for_hanjunhee");
      }
      return { user: mockUser, token: "mock_jwt_token_for_hanjunhee" };
    }

    const res = await fetch(`${BACKEND_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken })
    });
    
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Google login failed");
    }

    const token = data.token;
    const decoded = decodeJwt(token);
    if (!decoded) {
      throw new Error("Invalid JWT token received from backend");
    }

    const user: User = {
      id: String(decoded.id),
      name: decoded.name,
      email: decoded.email,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${decoded.name}`
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("skku_postit_user", JSON.stringify(user));
      localStorage.setItem("skku_postit_token", token);
    }

    return { user, token };
  },

  // Developer Bypass Auth for easy testing
  async loginDeveloperMock(email: string, name: string): Promise<User> {
    const mockUser: User = {
      id: "101",
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("skku_postit_user", JSON.stringify(mockUser));
      localStorage.setItem("skku_postit_token", "mock_jwt_token_for_" + name);
    }
    return mockUser;
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skku_postit_user");
      localStorage.removeItem("skku_postit_token");
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("skku_postit_user");
    return stored ? JSON.parse(stored) : null;
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("skku_postit_token");
  },

  // Post-It Operations
  async getPostIts(page = 1, filter = "all"): Promise<{ items: PostItData[]; count: number }> {
    if (!backendActive) {
      // Mock retrieval
      const data = getStoredData();
      const currentUser = this.getCurrentUser();
      const filtered = data.postIts.filter(p => {
        if (filter === "my" && currentUser) {
          return p.ownerId === currentUser.id;
        }
        return true;
      });
      return {
        items: filtered.slice((page - 1) * 8, page * 8),
        count: filtered.length
      };
    }

    const token = this.getToken();
    const filterParam = filter === "my" ? "mine" : "all";
    const res = await fetch(`${BACKEND_URL}/post-its?page=${page}&filter=${filterParam}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch post-its");
    }

    const items: PostItData[] = data["post-its"].map((p: any) => ({
      id: String(p.id),
      title: `${p.user_name}의 포스트잇`,
      date: p.created_at ? new Date(p.created_at).toISOString().split("T")[0] : "",
      color: getColorForId(p.id),
      ownerId: String(p.user_id),
      ownerName: p.user_name
    }));

    return {
      items,
      count: data.count
    };
  },

  // Todo Operations
  async getTodos(postItId: string): Promise<Todo[]> {
    if (!backendActive) {
      // Mock retrieval
      return getStoredData().todos.filter(t => t.postItId === postItId);
    }

    const token = this.getToken();
    const res = await fetch(`${BACKEND_URL}/post-its/${postItId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch todos");
    }

    return data.todos.map((t: any) => ({
      id: String(t.id),
      postItId: String(t.post_it_id),
      text: t.content,
      completed: t.completed_at !== null
    }));
  },

  async createTodo(postItId: string, text: string): Promise<Todo> {
    if (!backendActive) {
      // Mock create
      const newTodo: Todo = {
        id: Math.random().toString(36).substring(2, 9),
        postItId,
        text,
        completed: false
      };
      const data = getStoredData();
      data.todos.push(newTodo);
      setStoredData(data);
      return newTodo;
    }

    const token = this.getToken();
    const res = await fetch(`${BACKEND_URL}/post-its/${postItId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        content: text,
        due_date: null
      })
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to create todo");
    }

    return {
      id: String(data.todo.id),
      postItId: String(data.todo.post_it_id || postItId),
      text: data.todo.content,
      completed: data.todo.completed_at !== null
    };
  },

  async toggleTodo(postItId: string, todoId: string, isCompleted: boolean): Promise<Todo> {
    if (!backendActive) {
      // Mock toggle
      const data = getStoredData();
      const todo = data.todos.find(t => t.id === todoId);
      if (todo) {
        todo.completed = isCompleted;
        setStoredData(data);
        return todo;
      }
      throw new Error("Todo not found");
    }

    const token = this.getToken();
    const res = await fetch(`${BACKEND_URL}/post-its/${postItId}/todos/${todoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        isCompleted
      })
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to complete todo");
    }

    return {
      id: String(data.todo.id),
      postItId: String(data.todo.post_it_id || postItId),
      text: data.todo.content,
      completed: data.todo.completed_at !== null
    };
  },

  async deleteTodo(postItId: string, todoId: string): Promise<void> {
    if (!backendActive) {
      // Mock delete
      const data = getStoredData();
      data.todos = data.todos.filter(t => t.id !== todoId);
      setStoredData(data);
      return;
    }

    const token = this.getToken();
    const res = await fetch(`${BACKEND_URL}/post-its/${postItId}/todos/${todoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to delete todo");
    }
  }
};
