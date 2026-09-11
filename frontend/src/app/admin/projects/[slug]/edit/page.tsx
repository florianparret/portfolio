import { notFound } from "next/navigation";
import { fetchProject } from "@/lib/api";
import { ProjectForm } from "../../../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">
        Modifier « {project.title} »
      </h1>
      <ProjectForm mode="edit" project={project} />
    </section>
  );
}
