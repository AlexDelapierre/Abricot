"use client";

import { createCommentAction, deleteTaskAction } from "@/actions";
import TaskModal from "@/components/TaskModal";
import type { ProjectTask, User } from "@/types";
import { getInitials, statuses } from "@/utils";

export default function ProjectTaskCard({
  projectId,
  task,
  team,
  user,
}: {
  projectId: string;
  task: ProjectTask;
  team: Pick<User, "id" | "email" | "name">[];
  user: User;
}) {
  const status = statuses[task.status];

  return (
    <article className="rounded-card border-grey-200 border bg-white p-6 md:px-10 md:py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg">{task.title}</h3>
            <span
              className={`rounded-full px-4 py-1 text-sm ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <p className="text-grey-600 text-sm">{task.description}</p>
        </div>

        <details className="relative shrink-0">
          <summary
            aria-label="Actions de la tâche"
            className="rounded-card border-grey-200 flex h-14 w-14 cursor-pointer hover:border-brand-dark hover:text-brand-dark list-none items-center justify-center border"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </summary>
          <div className="rounded-card border-grey-200 text-grey-600 absolute right-0 z-10 mt-2 flex items-center gap-3 border bg-white px-6 py-4 text-sm whitespace-nowrap shadow-md">
            <form
              action={deleteTaskAction}
              onSubmit={(event) => {
                if (!confirm("Supprimer cette tâche ?")) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="taskId" value={task.id} />
              <button type="submit" className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9 3h6l1 2h4v2H4V5h4zM6 9h12l-1 12H7z" />
                </svg>
                Supprimer
              </button>
            </form>
            <span aria-hidden="true">|</span>
            <TaskModal projectId={projectId} team={team} task={task} />
          </div>
        </details>
      </div>

      <p className="text-grey-600 mt-6 flex items-center gap-2 text-xs">
        Échéance :
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        </svg>
        <span className="text-grey-800">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })
            : "Aucune"}
        </span>
      </p>

      <div className="text-grey-600 mt-4 flex flex-wrap items-center gap-2 text-xs">
        Assigné à :
        {task.assignees.length === 0 && (
          <span className="text-grey-800">Personne</span>
        )}
        <ul className="flex flex-wrap gap-2">
          {task.assignees.map((assignee) => (
            <li key={assignee.id} className="flex items-center gap-[5px]">
              <span className="bg-grey-200 text-grey-950 flex h-[27px] w-[27px] items-center justify-center rounded-full text-[10px]">
                {getInitials(assignee.user.name ?? assignee.user.email)}
              </span>
              <span className="bg-grey-200 rounded-full px-4 py-1 text-sm">
                {assignee.user.name ?? assignee.user.email}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <details className="group border-grey-200 mt-6 border-t pt-6">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm">
          Commentaires ({task.comments.length})
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="group-open:rotate-180"
            aria-hidden="true"
          >
            <path d="M4 16l8-8 8 8" />
          </svg>
        </summary>

        <ul className="mt-6 flex flex-col gap-4">
          {task.comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <span className="bg-grey-200 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full text-[10px]">
                {getInitials(comment.author.name ?? comment.author.email)}
              </span>
              <div className="rounded-card bg-grey-100 flex-1 px-5 py-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="text-sm">
                    {comment.author.name ?? comment.author.email}
                  </p>
                  <p className="text-grey-600 text-xs">
                    {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                    })}
                    ,{" "}
                    {new Date(comment.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="mt-3 text-xs">{comment.content}</p>
              </div>
            </li>
          ))}
        </ul>

        <form
          action={createCommentAction}
          className="group/comment mt-6 flex flex-col gap-4"
        >
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="taskId" value={task.id} />
          <div className="flex gap-3">
            <span className="bg-brand-light flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full text-[10px]">
              {getInitials(user.name ?? user.email)}
            </span>
            <textarea
              name="content"
              required
              rows={3}
              maxLength={2000}
              aria-label="Ajouter un commentaire"
              placeholder="Ajouter un commentaire..."
              className="rounded-card bg-grey-100 flex-1 px-5 py-4 text-xs"
            />
          </div>
          <button
            type="submit"
            className="rounded-card bg-grey-800 hover:bg-grey-950 group-invalid/comment:bg-grey-200 group-invalid/comment:text-grey-400 h-[50px] self-end px-[54px] text-white group-invalid/comment:pointer-events-none"
          >
            Envoyer
          </button>
        </form>
      </details>
    </article>
  );
}
