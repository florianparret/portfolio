import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Projet introuvable</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Ce projet n&apos;existe pas ou plus.</p>
      <Link
        href="/projects"
        className="w-fit rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
      >
        Retour aux projets
      </Link>
    </section>
  );
}
