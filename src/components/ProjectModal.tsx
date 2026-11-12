"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  createProjectAction,
  deleteProjectAction,
  searchUsersAction,
  updateProjectAction,
} from "@/actions";
import type { Project, User } from "@/types";

type Contributor = Pick<User, "id" | "email" | "name">;

export default function ProjectModal({ project }: { project?: Project }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(
    project ? updateProjectAction : createProjectAction,
    {
      error: "",
      saved: false,
      name: project?.name ?? "",
      description: project?.description ?? "",
    },
  );
  const [contributors, setContributors] = useState<Contributor[]>(
    project?.members.map((member) => member.user) ?? [],
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Contributor[]>([]);

  useEffect(() => {
    if (state.saved) {
      dialog.current?.close();
    }
  }, [state]);

  async function search(value: string) {
    setQuery(value);
    setResults(
      value.trim().length < 2 ? [] : await searchUsersAction(value.trim()),
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={
          project
            ? "text-brand-dark hover:text-grey-950 text-sm underline"
            : "rounded-card bg-grey-800 hover:bg-grey-950 h-[50px] px-[26px] text-white"
        }
      >
        {project ? "Modifier" : "+ Créer un projet"}
      </button>

      <dialog
        ref={dialog}
        aria-label={project ? "Modifier un projet" : "Créer un projet"}
        className="rounded-card m-auto w-[598px] max-w-[calc(100%-2rem)] p-0 backdrop:bg-black/40"
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
              {project ? "Modifier un projet" : "Créer un projet"}
            </h2>

            {project && <input type="hidden" name="id" value={project.id} />}

            <label className="flex flex-col gap-[7px] text-sm">
              Titre*
              <input
                name="name"
                defaultValue={state.name}
                required
                className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
              />
            </label>

            <label className="flex flex-col gap-[7px] text-sm">
              Description*
              <input
                name="description"
                defaultValue={state.description}
                required
                className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
              />
            </label>

            <div className="flex flex-col gap-[7px]">
              <label htmlFor="contributors-search" className="text-sm">
                Contributeurs
              </label>
              <div className="relative">
                <input
                  id="contributors-search"
                  value={query}
                  onChange={(event) => search(event.target.value)}
                  placeholder={
                    contributors.length > 0
                      ? `${contributors.length} collaborateur${contributors.length > 1 ? "s" : ""}`
                      : "Choisir un ou plusieurs collaborateurs"
                  }
                  autoComplete="off"
                  className="border-grey-200 w-full rounded-sm border bg-white px-[17px] py-[19px] text-base"
                />
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <path d="M4 8l8 8 8-8" />
                </svg>
              </div>

              {results.length > 0 && (
                <ul className="border-grey-200 rounded-sm border bg-white">
                  {results
                    .filter(
                      (user) =>
                        !contributors.some(
                          (contributor) => contributor.id === user.id,
                        ),
                    )
                    .map((user) => (
                      <li key={user.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setContributors([...contributors, user]);
                            setQuery("");
                            setResults([]);
                          }}
                          className="hover:bg-grey-100 flex w-full flex-col px-[17px] py-2 text-left text-sm"
                        >
                          {user.name ?? user.email}
                          <span className="text-grey-600 text-xs">
                            {user.email}
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              )}

              {contributors.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {contributors.map((contributor) => (
                    <li
                      key={contributor.id}
                      className="bg-grey-200 text-grey-600 flex items-center gap-2 rounded-full px-4 py-1 text-sm"
                    >
                      <input
                        type="hidden"
                        name="contributors"
                        value={contributor.email}
                      />
                      {contributor.name ?? contributor.email}
                      <button
                        type="button"
                        aria-label={`Retirer ${contributor.name ?? contributor.email}`}
                        onClick={() =>
                          setContributors(
                            contributors.filter(
                              (item) => item.id !== contributor.id,
                            ),
                          )
                        }
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
              {project ? "Enregistrer" : "Ajouter un projet"}
            </button>
          </form>

          {project && (
            <form
              action={deleteProjectAction}
              onSubmit={(event) => {
                if (!confirm("Supprimer ce projet et toutes ses tâches ?")) {
                  event.preventDefault();
                }
              }}
              className="mt-6"
            >
              <input type="hidden" name="id" value={project.id} />
              <button type="submit" className="text-error text-sm underline">
                Supprimer le projet
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
