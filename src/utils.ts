import type { Task } from "@/types";

const priorities = ["URGENT", "HIGH", "MEDIUM", "LOW"];

export const statuses = {
  TODO: { label: "À faire", className: "bg-error-light text-error" },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-warning-light text-warning",
  },
  DONE: { label: "Terminée", className: "bg-success-light text-success" },
  CANCELLED: { label: "Annulée", className: "bg-grey-200 text-grey-600" },
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function byPriority(
  a: Pick<Task, "priority" | "dueDate">,
  b: Pick<Task, "priority" | "dueDate">,
) {
  return (
    priorities.indexOf(a.priority) - priorities.indexOf(b.priority) ||
    (a.dueDate ?? "9").localeCompare(b.dueDate ?? "9")
  );
}
