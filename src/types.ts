export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface ProjectFormState {
  error: string;
  saved: boolean;
  name: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner: Pick<User, "id" | "email" | "name">;
  members: { id: string; user: Pick<User, "id" | "email" | "name"> }[];
  userRole: "ADMIN" | "CONTRIBUTOR";
  _count: { tasks: number };
  tasks?: Task[];
}
