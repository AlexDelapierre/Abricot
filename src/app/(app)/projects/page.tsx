import { redirect } from "next/navigation";
import { getProject, getProjects } from "@/api";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";

export default async function ProjectsPage() {
  const response = await getProjects();

  if (!response.data) {
    redirect("/login");
  }

  const projects = await Promise.all(
    response.data.projects.map(
      async (project) =>
        (await getProject(project.id)).data?.project ?? project,
    ),
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

      {projects.length === 0 ? (
        <p className="text-grey-600">Vous n&apos;avez pas encore de projet.</p>
      ) : (
        <ul className="grid gap-x-[14px] gap-y-[18px] md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
