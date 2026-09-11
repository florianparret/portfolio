import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProject } from "@/lib/api";

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
    <section className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(79,70,229,0.10),transparent_45%)] dark:bg-[radial-gradient(circle_at_15%_10%,rgba(129,140,248,0.14),transparent_45%)]"
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-24">
        <Link
          href="/projects"
          className="w-fit text-sm text-zinc-500 transition-colors hover:text-accent dark:text-zinc-500"
        >
          ← Retour aux projets
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>

        <ul className="flex flex-wrap gap-2 text-xs">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-medium text-accent"
            >
              {tech}
            </li>
          ))}
        </ul>

        <p className="text-lg text-zinc-600 dark:text-zinc-400">{project.description}</p>

        {(project.repoUrl || project.demoUrl) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/[.08] px-5 py-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                Voir le code →
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Voir la démo →
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
