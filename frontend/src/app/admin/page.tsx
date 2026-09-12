import { fetchProjects } from "@/lib/api";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminGuard } from "./AdminGuard";
import { LogoutButton } from "./LogoutButton";
import { DeleteProjectButton } from "./DeleteProjectButton";

export default async function AdminPage() {
  const result = await fetchProjects();

  return (
    <AdminGuard>
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-24">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Espace admin</h1>
          <LogoutButton />
        </div>

        <LinkButton href="/admin/projects/new" variant="primary" className="w-fit">
          Nouveau projet
        </LinkButton>

        {!result.success && (
          <p className="text-muted">Impossible de charger les projets pour le moment.</p>
        )}

        {result.success && result.projects.length === 0 && (
          <p className="text-muted">Aucun projet pour le moment.</p>
        )}

        {result.success && result.projects.length > 0 && (
          <ul className="flex flex-col gap-4">
            {result.projects.map((project) => (
              <li
                key={project.slug}
                className="flex items-center justify-between rounded border-2 border-border p-4"
              >
                <span className="font-medium">{project.title}</span>
                <div className="flex gap-2">
                  <LinkButton
                    href={`/admin/projects/${project.slug}/edit`}
                    variant="secondary"
                  >
                    Modifier
                  </LinkButton>
                  <DeleteProjectButton slug={project.slug} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminGuard>
  );
}
