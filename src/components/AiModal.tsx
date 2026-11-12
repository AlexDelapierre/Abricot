"use client";

import { useRef, useState } from "react";

const starPath =
  "M12 2c.6 4.8 2.4 6.6 10 10-7.6 3.4-9.4 5.2-10 10-.6-4.8-2.4-6.6-10-10 7.6-3.4 9.4-5.2 10-10z";

export default function AiModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [hasTasks, setHasTasks] = useState(false);

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
        onClose={() => setHasTasks(false)}
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

          {hasTasks && (
            <>
              <ul className="mt-[60px] flex flex-col gap-6">
                {[1, 2, 3].map((number) => (
                  <li
                    key={number}
                    className="rounded-card border-grey-200 border px-10 py-7"
                  >
                    <h3 className="text-lg">Nom de la tâche</h3>
                    <p className="text-grey-600 mt-2 text-sm">
                      Description de la tâche
                    </p>
                    <div className="text-grey-600 mt-6 flex items-center gap-3 text-sm">
                      <button type="button" className="flex items-center gap-2">
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
                      <button type="button" className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M15.2 4.8l4 4L8 20H4v-4zM17 3a2.8 2.8 0 0 1 4 4l-.8.8-4-4z" />
                        </svg>
                        Modifier
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="rounded-card bg-grey-800 mt-6 h-[50px] self-center px-[26px] text-white"
              >
                + Ajouter les tâches
              </button>
            </>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setHasTasks(true);
            }}
            className={`mt-auto pt-6 ${
              hasTasks
                ? "border-grey-200 -mx-6 mt-6 border-t px-6 md:-mx-[73px] md:px-[73px]"
                : ""
            }`}
          >
            <div className="bg-grey-50 flex items-center gap-4 rounded-full px-8 py-5">
              <input
                required
                aria-label="Décrivez les tâches que vous souhaitez ajouter"
                placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                className="flex-1 bg-transparent text-xs"
              />
              <button
                type="submit"
                aria-label="Générer les tâches"
                className="bg-brand-dark flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
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
