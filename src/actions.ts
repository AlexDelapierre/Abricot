"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login, register } from "@/api";

export async function loginAction(
  previousState: { error?: string },
  formData: FormData,
) {
  const response = await login(
    String(formData.get("email")),
    String(formData.get("password")),
  );

  if (!response.success || !response.data) {
    return { error: response.message };
  }

  (await cookies()).set("token", response.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/dashboard");
}

export async function registerAction(
  previousState: { error?: string },
  formData: FormData,
) {
  const response = await register(
    String(formData.get("email")),
    String(formData.get("password")),
  );

  if (!response.success || !response.data) {
    return { error: response.message };
  }

  (await cookies()).set("token", response.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/dashboard");
}

export async function logoutAction() {
  (await cookies()).delete("token");
  redirect("/login");
}
