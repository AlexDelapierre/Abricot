import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile, getProject, getTasks } from "@/api";
import AiModal from "@/components/AiModal";
import ProjectModal from "@/components/ProjectModal";
import ProjectTaskCard from "@/components/ProjectTaskCard";
import TaskModal from "@/components/TaskModal";
import { byPriority, getInitials, statuses } from "@/utils";

export default async function ProjectPage({
  params,
  searchParams,
}: PageProps<"/projects/[projectId]">) {
  const { projectId } = await params;
  const filters = await searchParams;
  const status = String(filters.status ?? "");
  const query = String(filters.q ?? "");

  const [response, tasksResponse, profile] = await Promise.all([
    getProject(projectId),
    getTasks(projectId),
    getProfile(),
  ]);

  if (!response.data || !profile.data) {
    redirect("/projects");
  }

  const { project } = response.data;
  const currentUser = profile.data.user;
  const team = [project.owner, ...project.members.map((member) => member.user)];
  const tasks = (tasksResponse.data?.tasks ?? [])
    .filter((task) => !status || task.status === status)
    .filter((task) =>
      `${task.title} ${task.description ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort(byPriority);

  return (
    <section className="mx-auto mt-11 flex max-w-[1283px] flex-col gap-12">
      <div className="flex flex-wrap items-start gap-[17px]">
        <Link
          href="/projects"
          aria-label="Retour aux projets"
          className="rounded-card border-grey-200 flex h-14 w-14 shrink-0 items-center justify-center hover:border-brand-dark hover:text-brand-dark border bg-white"
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
            <path d="M20 12H4M10 6l-6 6 6 6" />
          </svg>
        </Link>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="text-2xl">{project.name}</h1>
            {project.userRole === "ADMIN" && <ProjectModal project={project} />}
          </div>
          <p className="text-grey-600 text-lg">{project.description}</p>
        </div>

        <div className="flex gap-3">
          <TaskModal projectId={project.id} team={team} />
          <AiModal />
        </div>
      </div>

      <div className="rounded-card bg-grey-100 flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:ml-[68px] md:px-[50px]">
        <h2 className="flex items-baseline gap-2 text-lg">
          Contributeurs
          <span className="text-grey-600 font-sans text-base font-normal">
            {team.length} personne{team.length > 1 && "s"}
          </span>
        </h2>

        <ul className="flex flex-wrap gap-2">
          {team.map((user, position) => (
            <li key={user.id} className="flex items-center gap-[5px]">
              <span
                className={`flex h-[27px] w-[27px] items-center justify-center rounded-full text-[10px] ${
                  position === 0 ? "bg-brand-light" : "bg-grey-200"
                }`}
              >
                {getInitials(user.name ?? user.email)}
              </span>
              <span
                className={`rounded-full px-4 py-1 text-sm ${
                  position === 0
                    ? "bg-brand-light text-brand-dark"
                    : "bg-grey-200 text-grey-600"
                }`}
              >
                {position === 0 ? "Propriétaire" : (user.name ?? user.email)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border-grey-200 border bg-white px-6 py-10 md:ml-[68px] md:px-[59px]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg">Tâches</h2>
            <p className="text-grey-600">Par ordre de priorité</p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-4 md:w-auto">
            <nav aria-label="Vues des tâches" className="flex gap-3">
              <span
                aria-current="page"
                className="rounded-card bg-brand-light text-brand-dark flex items-center gap-3 px-5 py-3"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
                </svg>
                Liste
              </span>
              <button
                type="button"
                className="rounded-card text-brand-dark hover:bg-brand-light flex items-center gap-3 px-5 py-3"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
                </svg>
                Calendrier
              </button>
            </nav>

            <details key={status} className="relative w-full md:w-[152px]">
              <summary className="border-grey-200 text-grey-600 flex h-[62px] cursor-pointer list-none items-center justify-between rounded-sm border bg-white px-[30px]">
                {status
                  ? statuses[status as keyof typeof statuses].label
                  : "Statut"}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M4 8l8 8 8-8" />
                </svg>
              </summary>
              <ul className="rounded-card border-grey-200 absolute z-10 mt-1 w-full border bg-white py-2 shadow-md">
                {["", "TODO", "IN_PROGRESS", "DONE"].map((value) => (
                  <li key={value}>
                    <Link
                      href={{ query: { status: value, q: query } }}
                      aria-current={value === status ? "true" : undefined}
                      className="hover:bg-grey-100 block px-[30px] py-2"
                    >
                      {value
                        ? statuses[value as keyof typeof statuses].label
                        : "Tous"}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            <form role="search" className="relative w-full md:w-[283px]">
              {status && <input type="hidden" name="status" value={status} />}
              <input
                name="q"
                defaultValue={query}
                placeholder="Rechercher une tâche"
                aria-label="Rechercher une tâche"
                className="border-grey-200 h-[62px] w-full rounded-sm border bg-white pr-14 pl-[30px] text-base"
              />
              <button
                type="submit"
                aria-label="Rechercher"
                className="text-grey-600 absolute top-1/2 right-5 -translate-y-1/2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p className="text-grey-600 mt-12">
            {status || query
              ? "Aucune tâche ne correspond à votre recherche."
              : "Aucune tâche pour le moment."}
          </p>
        ) : (
          <ul className="mt-12 flex flex-col gap-[18px] md:px-10">
            {tasks.map((task) => (
              <li key={task.id}>
                <ProjectTaskCard
                  projectId={project.id}
                  task={task}
                  team={team}
                  user={currentUser}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
