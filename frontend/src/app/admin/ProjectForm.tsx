"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/lib/api";
import type { Project } from "@/types/project";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

type ProjectFormProps = { mode: "create" } | { mode: "edit"; project: Project };

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
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          disabled={props.mode === "edit"}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="stack">Stack (séparée par des virgules)</Label>
        <Input
          id="stack"
          value={stack}
          onChange={(event) => setStack(event.target.value)}
          required
          placeholder="Next.js, Spring Boot, PostgreSQL"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="repoUrl">Lien du repo (optionnel)</Label>
        <Input
          id="repoUrl"
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="demoUrl">Lien de démo (optionnel)</Label>
        <Input
          id="demoUrl"
          value={demoUrl}
          onChange={(event) => setDemoUrl(event.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Enregistrement..." : props.mode === "create" ? "Créer" : "Enregistrer"}
      </Button>
    </form>
  );
}
