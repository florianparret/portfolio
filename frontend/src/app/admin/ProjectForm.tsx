"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/lib/api";
import type { Project } from "@/types/project";

type ProjectFormProps = { mode: "create" } | { mode: "edit"; project: Project };

const inputClassName =
  "rounded-md border border-black/[.08] px-3 py-2 disabled:opacity-50 dark:border-white/[.145] dark:bg-transparent";

export function ProjectForm(props: ProjectFormProps) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.project : undefined;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [stack, setStack] = useState(initial?.stack.join(", ") ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(initial?.demoUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const stackList = stack
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    const success =
      props.mode === "create"
        ? await createProject({
            slug,
            title,
            description,
            stack: stackList,
            repoUrl: repoUrl || undefined,
            demoUrl: demoUrl || undefined,
          })
        : await updateProject(props.project.slug, {
            title,
            description,
            stack: stackList,
            repoUrl: repoUrl || undefined,
            demoUrl: demoUrl || undefined,
          });

    if (success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Échec de l'enregistrement (slug déjà pris, ou champ invalide).");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="slug" className="text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          disabled={props.mode === "edit"}
          required
          className={inputClassName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Titre
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className={inputClassName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          rows={4}
          className={inputClassName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="stack" className="text-sm font-medium">
          Stack (séparée par des virgules)
        </label>
        <input
          id="stack"
          value={stack}
          onChange={(event) => setStack(event.target.value)}
          required
          placeholder="Next.js, Spring Boot, PostgreSQL"
          className={inputClassName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="repoUrl" className="text-sm font-medium">
          Lien du repo (optionnel)
        </label>
        <input
          id="repoUrl"
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="demoUrl" className="text-sm font-medium">
          Lien de démo (optionnel)
        </label>
        <input
          id="demoUrl"
          value={demoUrl}
          onChange={(event) => setDemoUrl(event.target.value)}
          className={inputClassName}
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? "Enregistrement..." : props.mode === "create" ? "Créer" : "Enregistrer"}
      </button>
    </form>
  );
}
