import Link from "next/link";
import { fetchProjects } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default async function ProjectsPage() {
  const result = await fetchProjects();

  return (
    <section className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-accent uppercase">
          Sélection
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Projets</h1>

        {!result.success && (
          <p className="text-muted">Impossible de charger les projets pour le moment.</p>
        )}

        {result.success && result.projects.length === 0 && (
          <p className="text-muted">Aucun projet pour le moment.</p>
        )}

        {result.success && result.projects.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2">
            {result.projects.map((project, index) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="group block h-full">
                  <Card interactive className="flex h-full flex-col">
                    <span className="font-mono text-xs text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mt-2 text-xl font-semibold transition-colors group-hover:text-accent">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-muted">{project.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li key={tech}>
                          <Badge>{tech}</Badge>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
