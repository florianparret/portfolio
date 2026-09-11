import { LinkButton } from "@/components/ui/LinkButton";

export default function ProjectNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Projet introuvable</h1>
      <p className="text-muted">Ce projet n&apos;existe pas ou plus.</p>
      <LinkButton href="/projects" variant="primary">
        Retour aux projets
      </LinkButton>
    </section>
  );
}
