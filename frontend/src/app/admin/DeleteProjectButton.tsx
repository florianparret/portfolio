"use client";

import { useRouter } from "next/navigation";
import { deleteProject } from "@/lib/api";

export function DeleteProjectButton({ slug }: { slug: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm(`Supprimer le projet "${slug}" ?`)) {
      return;
    }

    await deleteProject(slug);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-full border border-red-600/30 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-600/10 dark:text-red-400"
    >
      Supprimer
    </button>
  );
}
