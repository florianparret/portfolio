import Link from "next/link";
import { fetchProjects } from "@/lib/api";
import { LogoutButton } from "./LogoutButton";
import { DeleteProjectButton } from "./DeleteProjectButton";

export default async function AdminPage() {
  const result = await fetchProjects();

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Espace admin</h1>
        <LogoutButton />
      </div>

      <Link
        href="/admin/projects/new"
        className="w-fit rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Nouveau projet
      </Link>

      {!result.success && (
        <p className="text-zinc-600 dark:text-zinc-400">
          Impossible de charger les projets pour le moment.
        </p>
      )}

      {result.success && result.projects.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">Aucun projet pour le moment.</p>
      )}

      {result.success && result.projects.length > 0 && (
        <ul className="flex flex-col gap-4">
          {result.projects.map((project) => (
            <li
              key={project.slug}
              className="flex items-center justify-between rounded-lg border border-black/[.08] p-4 dark:border-white/[.145]"
            >
              <span className="font-medium">{project.title}</span>
              <div className="flex gap-2">
                <Link
                  href={`/admin/projects/${project.slug}/edit`}
                  className="rounded-full border border-black/[.08] px-4 py-2 text-sm transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                >
                  Modifier
                </Link>
                <DeleteProjectButton slug={project.slug} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
