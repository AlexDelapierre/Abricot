"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login, register, updatePassword, updateProfile } from "@/api";

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

export async function updateProfileAction(
  previousState: {
    error: string;
    success: string;
    name: string;
    email: string;
  },
  formData: FormData,
) {
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const newPassword = String(formData.get("newPassword"));

  if (newPassword) {
    const password = await updatePassword(
      String(formData.get("currentPassword")),
      newPassword,
    );

    if (!password.success) {
      return { error: password.message, success: "", name, email };
    }
  }

  const profile = await updateProfile(name, email);

  if (!profile.success) {
    const error = newPassword
      ? `Mot de passe modifié, mais informations non enregistrées : ${profile.message}`
      : profile.message;

    return { error, success: "", name, email };
  }

  revalidatePath("/profile");
  return { error: "", success: "Informations mises à jour", name, email };
}

export async function logoutAction() {
  (await cookies()).delete("token");
  redirect("/login");
}
