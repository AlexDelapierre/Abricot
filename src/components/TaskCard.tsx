import Link from "next/link";
import type { AssignedTask } from "@/types";

const statuses = {
  TODO: { label: "À faire", className: "bg-error-light text-error" },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-warning-light text-warning",
  },
  DONE: { label: "Terminée", className: "bg-success-light text-success" },
  CANCELLED: { label: "Annulée", className: "bg-grey-200 text-grey-600" },
};

export default function TaskCard({
  task,
  kanban,
}: {
  task: AssignedTask;
  kanban?: boolean;
}) {
  const status = statuses[task.status];

  return (
    <article className="rounded-card border-grey-200 relative border bg-white p-6 md:px-10 md:py-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg">{task.title}</h3>
        <span
          className={`shrink-0 rounded-full px-4 py-1 text-sm ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <p className="text-grey-600 mt-2 text-sm">{task.description}</p>

      <ul className="text-grey-600 [&>li+li]:border-grey-400 mt-8 flex items-center text-xs whitespace-nowrap [&>li+li]:ml-3 [&>li+li]:border-l [&>li+li]:pl-3">
        <li className="flex min-w-0 items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="shrink-0"
            aria-hidden="true"
          >
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span title={task.project.name} className="truncate">
            {task.project.name}
          </span>
        </li>
        {task.dueDate && (
          <li className="flex items-center gap-2">
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
            {new Date(task.dueDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </li>
        )}
        <li className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          </svg>
          {task.comments.length}
          <span className="sr-only">commentaires</span>
        </li>
      </ul>

      <Link
        href={`/projects/${task.project.id}`}
        className={`rounded-card bg-grey-800 mt-6 flex h-[50px] w-[121px] items-center justify-center text-white ${
          kanban ? "" : "md:absolute md:right-10 md:bottom-8 md:mt-0"
        }`}
      >
        Voir
      </Link>
    </article>
  );
}
