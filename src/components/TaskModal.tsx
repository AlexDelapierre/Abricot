"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createTaskAction, updateTaskAction } from "@/actions";
import type { ProjectTask, User } from "@/types";
import { statuses } from "@/utils";

export default function TaskModal({
  projectId,
  team,
  task,
}: {
  projectId: string;
  team: Pick<User, "id" | "email" | "name">[];
  task?: ProjectTask;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(
    task ? updateTaskAction : createTaskAction,
    {
      error: "",
      saved: false,
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: task?.dueDate?.slice(0, 10) ?? "",
      status: task?.status ?? "TODO",
    },
  );
  const assigneeIds = task?.assignees.map((assignee) => assignee.user.id) ?? [];
  const [selectedIds, setSelectedIds] = useState(assigneeIds);

  useEffect(() => {
    if (state.saved) {
      dialog.current?.close();
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={
          task
            ? "flex items-center gap-2"
            : "rounded-card bg-grey-800 hover:bg-grey-950 h-[50px] px-[10px] text-white md:px-[26px]"
        }
      >
        {task && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.2 4.8l4 4L8 20H4v-4zM17 3a2.8 2.8 0 0 1 4 4l-.8.8-4-4z" />
          </svg>
        )}
        {task ? "Modifier" : "Créer une tâche"}
      </button>

      <dialog
        ref={dialog}
        onClose={() => {
          setSelectedIds(assigneeIds);
          dialog.current?.closest("details")?.removeAttribute("open");
        }}
        aria-label={task ? "Modifier une tâche" : "Créer une tâche"}
        className="rounded-card m-auto w-[598px] max-w-[calc(100%-2rem)] p-0 text-left backdrop:bg-black/40"
      >
        <div className="relative px-6 py-10 md:px-[73px] md:py-[79px]">
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => dialog.current?.close()}
            className="text-grey-600 absolute top-6 right-6 md:top-10 md:right-10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 3l18 18M21 3L3 21" />
            </svg>
          </button>

          <form action={formAction} className="group flex flex-col gap-6">
            <h2 className="mb-4 text-2xl">
              {task ? "Modifier" : "Créer une tâche"}
            </h2>

            <input type="hidden" name="projectId" value={projectId} />
            {task && <input type="hidden" name="taskId" value={task.id} />}

            <label className="flex flex-col gap-[7px] text-sm">
              Titre{task ? "" : "*"}
              <input
                name="title"
                defaultValue={state.title}
                required
                minLength={2}
                className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
              />
            </label>

            <label className="flex flex-col gap-[7px] text-sm">
              Description{task ? "" : "*"}
              <input
                name="description"
                defaultValue={state.description}
                required
                className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
              />
            </label>

            <label className="flex flex-col gap-[7px] text-sm">
              Échéance{task ? "" : "*"}
              <input
                name="dueDate"
                type="date"
                defaultValue={state.dueDate}
                required
                className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
              />
            </label>

            <fieldset className="flex flex-col gap-[7px] text-sm">
              <legend className="mb-[7px]">Assigné à :</legend>
              <details className="group/assignees">
                <summary className="border-grey-200 text-grey-600 flex cursor-pointer list-none items-center justify-between rounded-sm border bg-white px-[17px] py-[19px] text-base">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} collaborateur${selectedIds.length > 1 ? "s" : ""}`
                    : "Choisir un ou plusieurs collaborateurs"}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-grey-800 group-open/assignees:rotate-180"
                    aria-hidden="true"
                  >
                    <path d="M4 8l8 8 8-8" />
                  </svg>
                </summary>
                <ul className="border-grey-200 mt-1 rounded-sm border bg-white py-2">
                  {team.map((user) => (
                    <li key={user.id}>
                      <label className="hover:bg-grey-100 flex cursor-pointer items-center gap-3 px-[17px] py-2">
                        <input
                          type="checkbox"
                          name="assigneeIds"
                          value={user.id}
                          checked={selectedIds.includes(user.id)}
                          onChange={(event) =>
                            setSelectedIds(
                              event.target.checked
                                ? [...selectedIds, user.id]
                                : selectedIds.filter((id) => id !== user.id),
                            )
                          }
                        />
                        {user.name ?? user.email}
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            </fieldset>

            <fieldset className="text-sm">
              <legend className="mb-[7px]">Statut :</legend>
              <div className="flex flex-wrap gap-2">
                {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => (
                  <label
                    key={status}
                    className={`has-checked:ring-current has-focus-visible:outline-2 cursor-pointer rounded-full px-4 py-1 text-sm has-checked:ring-1 ${statuses[status].className}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      defaultChecked={state.status === status}
                      className="sr-only"
                    />
                    {statuses[status].label}
                  </label>
                ))}
              </div>
            </fieldset>

            {state.error && (
              <p role="alert" className="text-error text-sm">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="rounded-card bg-grey-800 hover:bg-grey-950 group-invalid:bg-grey-200 group-invalid:text-grey-400 disabled:bg-grey-200 mt-8 h-[50px] self-start px-6 text-white group-invalid:pointer-events-none"
            >
              {task ? "Enregistrer" : "+ Ajouter une tâche"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
