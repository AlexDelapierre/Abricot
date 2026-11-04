import { cookies } from "next/headers";
import type { ApiResponse, AuthData, User } from "@/types";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T> & { status: number }> {
  const token = (await cookies()).get("token")?.value;

  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const body = await response.json();

    return { ...body, status: response.status };
  } catch {
    return {
      success: false,
      message: "Serveur indisponible, réessayez plus tard",
      status: 503,
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
    body: JSON.stringify({ name, email }),
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
