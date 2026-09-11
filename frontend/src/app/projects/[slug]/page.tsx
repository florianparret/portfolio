import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProject } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) {
    return { title: "Projet introuvable" };
  }

  return {
    title: `${project.title} — Portfolio`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-24">
        <Link
          href="/projects"
          className="w-fit font-mono text-xs tracking-wide text-muted uppercase transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← Retour aux projets
        </Link>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {project.title}
        </h1>

        <ul className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>

        <p className="text-lg text-muted">{project.description}</p>

        {(project.repoUrl || project.demoUrl) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.repoUrl && (
              <LinkButton
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                Voir le code →
              </LinkButton>
            )}
            {project.demoUrl && (
              <LinkButton
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
              >
                Voir la démo →
              </LinkButton>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
