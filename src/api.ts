import { cookies } from "next/headers";
import type {
  ApiResponse,
  AssignedTask,
  AuthData,
  Project,
  ProjectTask,
  Task,
  User,
} from "@/types";

interface TaskFields {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assigneeIds: string[];
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = (await cookies()).get("token")?.value;

  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await response.json();
  } catch {
    return {
      success: false,
      message: "Serveur indisponible, réessayez plus tard",
    };
  }
}

export async function login(email: string, password: string) {
  return request<AuthData>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string) {
  return request<AuthData>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getProfile() {
  return request<{ user: User }>("/auth/profile");
}

export async function updateProfile(name: string, email: string) {
  return request<{ user: User }>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify({ name: name || undefined, email }),
  });
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
) {
  return request<undefined>("/auth/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function getAssignedTasks() {
  return request<{ tasks: AssignedTask[] }>("/dashboard/assigned-tasks");
}

export async function getProjects() {
  return request<{ projects: Project[] }>("/projects");
}

export async function getProject(id: string) {
  return request<{ project: Project }>(`/projects/${id}`);
}

export async function createProject(
  name: string,
  description: string,
  contributors: string[],
) {
  return request<{ project: Project }>("/projects", {
    method: "POST",
    body: JSON.stringify({ name, description, contributors }),
  });
}

export async function updateProject(
  id: string,
  name: string,
  description: string,
) {
  return request<{ project: Project }>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, description }),
  });
}

export async function deleteProject(id: string) {
  return request<undefined>(`/projects/${id}`, { method: "DELETE" });
}

export async function addContributor(id: string, email: string) {
  return request<undefined>(`/projects/${id}/contributors`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function removeContributor(id: string, userId: string) {
  return request<undefined>(`/projects/${id}/contributors/${userId}`, {
    method: "DELETE",
  });
}

export async function searchUsers(query: string) {
  return request<{ users: Pick<User, "id" | "email" | "name">[] }>(
    `/users/search?query=${encodeURIComponent(query)}`,
  );
}

export async function getTasks(projectId: string) {
  return request<{ tasks: ProjectTask[] }>(`/projects/${projectId}/tasks`);
}

export async function createTask(projectId: string, fields: TaskFields) {
  return request<{ task: Task }>(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(fields),
  });
}

export async function updateTask(
  projectId: string,
  taskId: string,
  fields: TaskFields,
) {
  return request<{ task: Task }>(`/projects/${projectId}/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(fields),
  });
}

export async function deleteTask(projectId: string, taskId: string) {
  return request<undefined>(`/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function createComment(
  projectId: string,
  taskId: string,
  content: string,
) {
  return request<undefined>(`/projects/${projectId}/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
