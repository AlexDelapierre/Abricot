import Link from "next/link";
import { redirect } from "next/navigation";
import { getProject } from "@/api";
import ProjectModal from "@/components/ProjectModal";
import { getInitials } from "@/utils";

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[projectId]">) {
  const { projectId } = await params;
  const response = await getProject(projectId);

  if (!response.data) {
    redirect("/projects");
  }

  const { project } = response.data;
  const team = [project.owner, ...project.members.map((member) => member.user)];

  return (
    <section className="mx-auto mt-11 flex max-w-[1283px] flex-col gap-12">
      <div className="flex items-start gap-[17px]">
        <Link
          href="/projects"
          aria-label="Retour aux projets"
          className="rounded-card border-grey-200 flex h-14 w-14 shrink-0 items-center justify-center border bg-white"
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

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="text-2xl">{project.name}</h1>
            {project.userRole === "ADMIN" && <ProjectModal project={project} />}
          </div>
          <p className="text-grey-600 text-lg">{project.description}</p>
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
    </section>
  );
}
