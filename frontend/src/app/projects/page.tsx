import Link from "next/link";
import { fetchProjects } from "@/lib/api";

export default async function ProjectsPage() {
  const result = await fetchProjects();

  return (
    <section className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(79,70,229,0.10),transparent_45%)] dark:bg-[radial-gradient(circle_at_15%_10%,rgba(129,140,248,0.14),transparent_45%)]"
      />
      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight">Projets</h1>

        {!result.success && (
          <p className="text-zinc-600 dark:text-zinc-400">
            Impossible de charger les projets pour le moment.
          </p>
        )}

        {result.success && result.projects.length === 0 && (
          <p className="text-zinc-600 dark:text-zinc-400">
            Aucun projet pour le moment.
          </p>
        )}

        {result.success && result.projects.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2">
            {result.projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block h-full rounded-lg border border-black/[.08] bg-black/[.015] p-6 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 dark:border-white/[.145] dark:bg-white/[.02]"
                >
                  <h2 className="text-xl font-semibold transition-colors group-hover:text-accent">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2 text-xs">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-medium text-accent"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
