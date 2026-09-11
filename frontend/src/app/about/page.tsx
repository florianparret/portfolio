import { aboutContent } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";

export default function AboutPage() {
  return (
    <section className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,var(--accent-glow),transparent_45%)]"
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-24 sm:flex-row sm:gap-12">
        <div className="flex flex-1 flex-col gap-6">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            Profil
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {aboutContent.heading}
          </h1>
          {aboutContent.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:w-48 sm:shrink-0">
          <h2 className="font-mono text-xs tracking-widest text-muted uppercase">
            Stack
          </h2>
          <ul className="flex flex-wrap gap-2 sm:flex-col">
            {aboutContent.stack.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
