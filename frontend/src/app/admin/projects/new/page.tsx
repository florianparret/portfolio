import { AdminGuard } from "../../AdminGuard";
import { ProjectForm } from "../../ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminGuard>
      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-24">
        <h1 className="text-2xl font-semibold tracking-tight">Nouveau projet</h1>
        <ProjectForm mode="create" />
      </section>
    </AdminGuard>
  );
}
