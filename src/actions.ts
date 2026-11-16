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
  generateTasks,
  getProfile,
  getProject,
  login,
  register,
  removeContributor,
  searchUsers,
  updatePassword,
  updateProfile,
  updateProject,
  updateTask,
} from "@/api";
import type { GeneratedTask, ProjectFormState, TaskFormState } from "@/types";

// Enregistrer le token dans un cookie inaccessible au JavaScript du navigateur
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
    lastName: string;
    firstName: string;
    email: string;
  },
  formData: FormData,
) {
  const lastName = String(formData.get("lastName")).trim();
  const firstName = String(formData.get("firstName")).trim();
  const email = String(formData.get("email"));
  const newPassword = String(formData.get("newPassword"));

  if (newPassword) {
    const password = await updatePassword(
      String(formData.get("currentPassword")),
      newPassword,
    );

    if (!password.success) {
      return {
        error: password.message,
        success: "",
        lastName,
        firstName,
        email,
      };
    }
  }

  // L'API n'a qu'un champ name : on assemble prénom et nom
  const profile = await updateProfile(
    [firstName, lastName].filter(Boolean).join(" "),
    email,
  );

  if (!profile.success) {
    const error = newPassword
      ? `Mot de passe modifié, mais informations non enregistrées : ${profile.message}`
      : profile.message;

    return { error, success: "", lastName, firstName, email };
  }

  revalidatePath("/profile");
  return {
    error: "",
    success: "Informations mises à jour",
    lastName,
    firstName,
    email,
  };
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

  // Ajouter les contributeurs qu'on vient de mettre dans la liste
  for (const email of emails) {
    if (!members.some((member) => member.user.email === email)) {
      await addContributor(id, email);
    }
  }

  // Retirer les contributeurs qu'on vient d'enlever de la liste
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

// Chercher les utilisateurs à ajouter au projet, sauf l'utilisateur connecté
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

  // L'API crée toujours la tâche « À faire », on change le statut juste après
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

// Générer des tâches avec Gemini à partir du nom et de la description du projet
export async function generateTasksAction(projectId: string, prompt: string) {
  const error = "La génération des tâches a échoué, réessayez plus tard";
  const project = await getProject(projectId);

  if (!project.data) {
    return { error, tasks: [] };
  }

  const { name, description } = project.data.project;
  const tasks = await generateTasks(
    `Tu aides à planifier le projet « ${name} » (${description ?? "sans description"}). Si la demande ci-dessous ne décrit pas de tâches à réaliser pour ce projet, renvoie un tableau vide. Sinon, propose exactement 3 tâches en français, avec un titre court de moins de 40 caractères et une description d'une seule phrase de moins de 55 caractères. Demande : ${prompt}`,
  );

  if (!tasks) {
    return { error, tasks: [] };
  }

  if (!tasks.length) {
    return {
      error: "Décrivez les tâches que vous souhaitez ajouter au projet",
      tasks,
    };
  }

  return { error: "", tasks };
}

export async function addGeneratedTasksAction(
  projectId: string,
  tasks: GeneratedTask[],
) {
  for (const task of tasks) {
    const response = await createTask(projectId, {
      ...task,
      dueDate: "",
      status: "TODO",
      assigneeIds: [],
    });

    if (!response.success) {
      revalidatePath(`/projects/${projectId}`);
      return response.message;
    }
  }

  revalidatePath(`/projects/${projectId}`);
  return "";
}

export async function logoutAction() {
  (await cookies()).delete("token");
  redirect("/login");
}
