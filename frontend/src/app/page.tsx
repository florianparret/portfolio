import Image from "next/image";
import { profile } from "@/lib/mock-data";
import { LinkButton } from "@/components/ui/LinkButton";

export default function Home() {
  return (
    <section className="relative flex flex-1 flex-col overflow-hidden bg-linear-to-br from-[var(--hero-from)] to-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--accent-glow),transparent_55%)]"
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-8 px-6 py-24 text-center sm:flex-row sm:items-center sm:text-left">
        <Image
          src="/portrait.png"
          alt={profile.name}
          width={160}
          height={160}
          priority
          className="h-40 w-40 shrink-0 rounded-full object-cover ring-2 ring-accent/40"
        />
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {profile.name}
          </h1>
          <p className="font-mono text-sm tracking-wide text-accent uppercase sm:text-base">
            {profile.title}
          </p>
          <p className="max-w-xl text-muted">{profile.intro}</p>
          <LinkButton href="/projects" variant="primary" className="group">
            Voir mes projets
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
