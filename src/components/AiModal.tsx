"use client";

import { useRef, useState, useTransition } from "react";
import { addGeneratedTasksAction, generateTasksAction } from "@/actions";
import type { GeneratedTask } from "@/types";

const starPath =
  "M12 2c.6 4.8 2.4 6.6 10 10-7.6 3.4-9.4 5.2-10 10-.6-4.8-2.4-6.6-10-10 7.6-3.4 9.4-5.2 10-10z";

export default function AiModal({ projectId }: { projectId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [editedIndex, setEditedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, startGenerating] = useTransition();
  const [isAdding, startAdding] = useTransition();
  // Cacher les anciennes tâches pendant une nouvelle génération
  const hasTasks = tasks.length > 0 && !isGenerating;

  function generateTasks(formData: FormData) {
    startGenerating(async () => {
      const result = await generateTasksAction(
        projectId,
        String(formData.get("prompt")),
      );
      setTasks(result.tasks);
      setEditedIndex(null);
      setError(result.error);
    });
  }

  function addTasks() {
    startAdding(async () => {
      const message = await addGeneratedTasksAction(projectId, tasks);

      if (message) {
        setError(message);
        return;
      }

      dialog.current?.close();
    });
  }

  function updateTask(
    index: number,
    field: keyof GeneratedTask,
    value: string,
  ) {
    setTasks(
      tasks.map((task, position) =>
        position === index ? { ...task, [field]: value } : task,
      ),
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="rounded-card bg-brand-dark flex h-[50px] items-center gap-2 px-6 text-white"
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={starPath} />
        </svg>
        IA
      </button>

      <dialog
        ref={dialog}
        aria-label={hasTasks ? "Vos tâches" : "Créer une tâche avec l'IA"}
        onClose={() => {
          setTasks([]);
          setEditedIndex(null);
          setError("");
        }}
        className="rounded-card m-auto w-[598px] max-w-[calc(100%-2rem)] p-0 backdrop:bg-black/40"
      >
        <div className="relative flex min-h-[min(859px,85vh)] flex-col px-6 pt-10 pb-6 md:px-[73px] md:pt-[79px] md:pb-[39px]">
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

          <h2 className="flex items-center gap-2 text-2xl">
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-brand-main"
              aria-hidden="true"
            >
              <path d={starPath} />
            </svg>
            {hasTasks ? "Vos tâches..." : "Créer une tâche"}
          </h2>

          {isGenerating && (
            <p role="status" className="text-grey-600 mt-[60px] text-sm">
              Génération des tâches...
            </p>
          )}

          {error && !isGenerating && (
            <p role="alert" className="text-error mt-6 text-sm">
              {error}
            </p>
          )}

          {hasTasks && (
            <>
              <ul className="mt-10 flex flex-col gap-6">
                {tasks.map((task, index) => (
                  <li
                    key={index}
                    className="rounded-card border-grey-200 border px-10 py-[25px]"
                  >
                    {editedIndex === index ? (
                      <div className="flex flex-col gap-2">
                        <input
                          aria-label="Titre"
                          value={task.title}
                          onChange={(event) =>
                            updateTask(index, "title", event.target.value)
                          }
                          className="border-grey-200 rounded-sm border px-3 py-2 text-lg"
                        />
                        <textarea
                          aria-label="Description"
                          value={task.description}
                          onChange={(event) =>
                            updateTask(index, "description", event.target.value)
                          }
                          className="border-grey-200 rounded-sm border px-3 py-2 text-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg leading-[25px]">{task.title}</h3>
                        <p className="text-grey-600 mt-[7px] text-sm leading-[17px]">
                          {task.description}
                        </p>
                      </>
                    )}
                    <div className="text-grey-600 mt-8 flex items-center gap-[15px] text-xs leading-[15px]">
                      <button
                        type="button"
                        onClick={() => {
                          setTasks(
                            tasks.filter((_, position) => position !== index),
                          );
                          setEditedIndex(null);
                        }}
                        className="flex items-center gap-1"
                      >
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
                      <span aria-hidden="true">|</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditedIndex(editedIndex === index ? null : index)
                        }
                        className="flex items-center gap-1"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M15.2 4.8l4 4L8 20H4v-4zM17 3a2.8 2.8 0 0 1 4 4l-.8.8-4-4z" />
                        </svg>
                        {editedIndex === index ? "Valider" : "Modifier"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={addTasks}
                disabled={isGenerating || isAdding}
                className="rounded-card bg-grey-800 hover:bg-grey-950 disabled:bg-grey-200 disabled:text-grey-400 mt-6 mb-6 h-[50px] self-center px-[26px] text-white"
              >
                {isAdding ? "Ajout des tâches..." : "+ Ajouter les tâches"}
              </button>
            </>
          )}

          <form
            action={generateTasks}
            className={`mt-auto pt-6 ${
              hasTasks
                ? "border-grey-200 -mx-6 border-t px-6 md:-mx-[73px] md:px-[73px]"
                : ""
            }`}
          >
            <div className="bg-grey-50 focus-within:ring-brand-dark flex items-center gap-4 rounded-full px-8 py-5 focus-within:ring-1">
              <input
                name="prompt"
                autoComplete="off"
                required
                aria-label="Décrivez les tâches que vous souhaitez ajouter"
                placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                className="flex-1 bg-transparent text-xs outline-none"
              />
              <button
                type="submit"
                disabled={isGenerating || isAdding}
                aria-label="Générer les tâches"
                className="bg-brand-dark hover:bg-brand-light hover:text-brand-dark flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d={starPath} />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
