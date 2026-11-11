export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
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
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string | null;
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

export interface AssignedTask extends Task {
  project: Pick<Project, "id" | "name">;
  comments: { id: string }[];
}
