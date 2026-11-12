"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addContributor,
  createComment,
  createProject,
  createTask,
  deleteProject,
  deleteTask,
  getProfile,
  login,
  register,
  removeContributor,
  searchUsers,
  updatePassword,
  updateProfile,
  updateProject,
  updateTask,
} from "@/api";
import type { ProjectFormState, TaskFormState } from "@/types";

async function saveToken(token: string) {
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function loginAction(
  previousState: { error?: string },
  formData: FormData,
) {
  const response = await login(
    String(formData.get("email")),
    String(formData.get("password")),
  );

  if (!response.data) {
    return { error: response.message };
  }

  await saveToken(response.data.token);
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

  if (!response.data) {
    return { error: response.message };
  }

  await saveToken(response.data.token);
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

export async function createProjectAction(
  previousState: ProjectFormState,
  formData: FormData,
) {
  const name = String(formData.get("name"));
  const description = String(formData.get("description"));

  const response = await createProject(
    name,
    description,
    formData.getAll("contributors").map(String),
  );

  if (!response.data) {
    return { error: response.message, saved: false, name, description };
  }

  revalidatePath("/projects");
  redirect(`/projects/${response.data.project.id}`);
}

export async function updateProjectAction(
  previousState: ProjectFormState,
  formData: FormData,
) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const description = String(formData.get("description"));
  const emails = formData.getAll("contributors").map(String);

  const response = await updateProject(id, name, description);

  if (!response.data) {
    return { error: response.message, saved: false, name, description };
  }

  const members = response.data.project.members;

  for (const email of emails) {
    if (!members.some((member) => member.user.email === email)) {
      await addContributor(id, email);
    }
  }

  for (const member of members) {
    if (!emails.includes(member.user.email)) {
      await removeContributor(id, member.user.id);
    }
  }

  revalidatePath(`/projects/${id}`);
  return { error: "", saved: true, name, description };
}

export async function deleteProjectAction(formData: FormData) {
  await deleteProject(String(formData.get("id")));

  revalidatePath("/projects");
  redirect("/projects");
}

export async function searchUsersAction(query: string) {
  const [response, profile] = await Promise.all([
    searchUsers(query),
    getProfile(),
  ]);

  return (response.data?.users ?? []).filter(
    (user) => user.id !== profile.data?.user.id,
  );
}

export async function createTaskAction(
  previousState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const projectId = String(formData.get("projectId"));
  const fields = {
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    dueDate: String(formData.get("dueDate")),
    status: String(formData.get("status")),
    assigneeIds: formData.getAll("assigneeIds").map(String),
  };

  const response = await createTask(projectId, fields);

  if (!response.data) {
    return { ...fields, error: response.message, saved: false };
  }

  if (fields.status !== "TODO") {
    await updateTask(projectId, response.data.task.id, fields);
  }

  revalidatePath(`/projects/${projectId}`);
  return {
    error: "",
    saved: true,
    title: "",
    description: "",
    dueDate: "",
    status: "TODO",
  };
}

export async function updateTaskAction(
  previousState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const projectId = String(formData.get("projectId"));
  const fields = {
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    dueDate: String(formData.get("dueDate")),
    status: String(formData.get("status")),
    assigneeIds: formData.getAll("assigneeIds").map(String),
  };

  const response = await updateTask(
    projectId,
    String(formData.get("taskId")),
    fields,
  );

  if (!response.data) {
    return { ...fields, error: response.message, saved: false };
  }

  revalidatePath(`/projects/${projectId}`);
  return { ...fields, error: "", saved: true };
}

export async function deleteTaskAction(formData: FormData) {
  const projectId = String(formData.get("projectId"));

  await deleteTask(projectId, String(formData.get("taskId")));
  revalidatePath(`/projects/${projectId}`);
}

export async function createCommentAction(formData: FormData) {
  const projectId = String(formData.get("projectId"));

  await createComment(
    projectId,
    String(formData.get("taskId")),
    String(formData.get("content")),
  );
  revalidatePath(`/projects/${projectId}`);
}

export async function logoutAction() {
  (await cookies()).delete("token");
  redirect("/login");
}
