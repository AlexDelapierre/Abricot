import Link from "next/link";
import { redirect } from "next/navigation";
import { getProject, getProjects } from "@/api";
import ProjectModal from "@/components/projects/ProjectModal";
import { getInitials } from "@/utils";

export default async function ProjectsPage() {
  const response = await getProjects();

  if (!response.data) {
    redirect("/login");
  }

  const { projects } = response.data;

  const doneCounts = await Promise.all(
    projects.map(async (project) => {
      const details = await getProject(project.id);

      return (
        details.data?.project.tasks?.filter((task) => task.status === "DONE")
          .length ?? 0
      );
    }),
  );

  return (
    <section className="mx-auto mt-11 flex max-w-[1166px] flex-col gap-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-[14px]">
          <h1 className="text-2xl">Mes projets</h1>
          <p className="text-lg text-black">Gérez vos projets</p>
        </div>
        <ProjectModal />
      </div>

      <ul className="grid gap-x-[14px] gap-y-[18px] md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const total = project._count.tasks;
          const done = doneCounts[index];
          const percent = total === 0 ? 0 : Math.round((done / total) * 100);
          const team = [
            project.owner,
            ...project.members.map((member) => member.user),
          ];

          return (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="rounded-card border-grey-200 flex h-[351px] flex-col justify-between gap-14 border bg-white px-[34px] py-[30px]"
              >
                <div className="flex min-h-[67px] flex-col gap-2">
                  <h2 className="text-lg leading-[25px]">{project.name}</h2>
                  <p className="text-grey-600 line-clamp-2 text-sm leading-[17px]">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-grey-600">Progression</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div
                      role="progressbar"
                      aria-label="Progression du projet"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percent}
                      className="bg-grey-200 h-[7px] rounded-full"
                    >
                      <div
                        className="bg-brand-dark h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-grey-600 text-[10px]">
                      {done}/{total} tâches terminées
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-[15px]">
                  <p className="text-grey-600 flex items-center gap-2 text-[10px]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="8" r="4" />
                      <path d="M1 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
                      <circle cx="18" cy="9" r="3" />
                      <path d="M17 14.2c3.7.5 6 3.3 6 6.8h-4.6c0-2.6-.5-4.8-1.4-6.8z" />
                    </svg>
                    Équipe ({team.length})
                  </p>
                  <ul className="flex items-center [&>li:nth-child(n+3)]:-ml-2">
                    {team.map((user, position) => (
                      <li
                        key={user.id}
                        className={
                          position === 0
                            ? "mr-1 flex items-center gap-[5px]"
                            : undefined
                        }
                      >
                        <span
                          title={user.name ?? user.email}
                          className={`flex h-[27px] w-[27px] items-center justify-center rounded-full text-[10px] ${
                            position === 0
                              ? "bg-brand-light"
                              : "bg-grey-200 border border-white"
                          }`}
                        >
                          {getInitials(user.name ?? user.email)}
                        </span>
                        {position === 0 && (
                          <span className="bg-brand-light text-brand-dark rounded-full px-4 py-1 text-sm">
                            Propriétaire
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
