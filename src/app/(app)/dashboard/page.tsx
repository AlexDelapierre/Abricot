import Link from "next/link";
import { redirect } from "next/navigation";
import { getAssignedTasks, getProfile, getProject } from "@/api";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import TaskCard from "@/components/TaskCard";

const priorities = ["URGENT", "HIGH", "MEDIUM", "LOW"];

const tabs = [
  {
    view: "tasks",
    label: "Liste",
    href: "/dashboard",
    icon: "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9",
  },
  {
    view: "kanban",
    label: "Kanban",
    href: "/dashboard?view=kanban",
    icon: "M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  },
  {
    view: "projects",
    label: "Mes projets",
    href: "/dashboard?view=projects",
    icon: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  },
];

const columns = [
  { status: "TODO", title: "À faire" },
  { status: "IN_PROGRESS", title: "En cours" },
  { status: "DONE", title: "Terminées" },
];

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const params = await searchParams;
  const view = tabs.find((tab) => tab.view === params.view) ?? tabs[0];
  const query = String(params.q ?? "");

  const [tasksResponse, profile] = await Promise.all([
    getAssignedTasks(),
    getProfile(),
  ]);

  if (!tasksResponse.data || !profile.data) {
    redirect("/login");
  }

  const tasks = tasksResponse.data.tasks.sort(
    (a, b) =>
      priorities.indexOf(a.priority) - priorities.indexOf(b.priority) ||
      (a.dueDate ?? "9").localeCompare(b.dueDate ?? "9"),
  );
  const user = profile.data.user;
  const visibleTasks = tasks.filter((task) =>
    `${task.title} ${task.description ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const projects = (
    view.view === "projects"
      ? await Promise.all(
          [...new Set(tasks.map((task) => task.project.id))].map(
            async (id) => (await getProject(id)).data?.project,
          ),
        )
      : []
  ).filter((project) => project !== undefined);

  return (
    <section className="mx-auto mt-11 flex max-w-[1215px] flex-col gap-[59px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-[14px]">
          <h1 className="text-2xl">Tableau de bord</h1>
          <p className="text-lg text-black">
            Bonjour {user.name ?? user.email}, voici un aperçu de vos projets et
            tâches
          </p>
        </div>
        <ProjectModal />
      </div>

      <div className="flex flex-col gap-8">
        <nav
          aria-label="Vues du tableau de bord"
          className="flex flex-wrap gap-3"
        >
          {tabs.map((tab) => (
            <Link
              key={tab.view}
              href={tab.href}
              aria-current={tab.view === view.view ? "page" : undefined}
              className={`rounded-card text-brand-dark flex items-center gap-3 px-5 py-3 ${
                tab.view === view.view ? "bg-brand-light" : "bg-white"
              }`}
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
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </Link>
          ))}
        </nav>

        {view.view === "tasks" && (
          <div className="rounded-card border-grey-200 border bg-white px-6 py-10 md:px-[70px]">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg">Mes tâches assignées</h2>
                <p className="text-grey-600">Par ordre de priorité</p>
              </div>

              <form
                action="/dashboard"
                role="search"
                className="relative w-full md:w-[355px]"
              >
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Rechercher une tâche"
                  aria-label="Rechercher une tâche"
                  className="border-grey-200 w-full rounded-sm border bg-white py-[19px] pr-14 pl-[30px] text-base"
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

            {visibleTasks.length === 0 ? (
              <p className="text-grey-600 mt-12">
                {query
                  ? "Aucune tâche ne correspond à votre recherche."
                  : "Aucune tâche ne vous est assignée."}
              </p>
            ) : (
              <ul className="mt-12 flex flex-col gap-[18px]">
                {visibleTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard task={task} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view.view === "kanban" && (
          <div className="grid gap-[22px] lg:-mx-[43px] lg:grid-cols-3">
            {columns.map((column) => {
              // const columnTasks = tasks.filter(
              //   (task) =>
              //     task.status === column.status &&
              //     task.dueDate?.startsWith(new Date().toISOString().slice(0, 7)),
              // );
              const columnTasks = tasks.filter(
                (task) => task.status === column.status,
              );

              return (
                <section
                  key={column.status}
                  className="rounded-card border-error-light border px-6 py-6"
                >
                  <h2 className="flex items-center gap-3 text-lg">
                    {column.title}
                    <span className="bg-grey-200 text-grey-600 rounded-full px-3 py-0.5 font-sans text-sm font-normal">
                      {columnTasks.length}
                    </span>
                  </h2>

                  <ul className="mt-10 flex flex-col gap-[18px]">
                    {columnTasks.map((task) => (
                      <li key={task.id}>
                        <TaskCard task={task} kanban />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}

        {view.view === "projects" && (
          <div>
            <h2 className="sr-only">Mes projets</h2>
            {projects.length === 0 ? (
              <p className="text-grey-600">
                Aucun projet : aucune tâche ne vous est assignée.
              </p>
            ) : (
              <ul className="grid gap-x-[14px] gap-y-[18px] md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <li key={project.id}>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
