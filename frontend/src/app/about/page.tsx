import { aboutContent } from "@/lib/mock-data";

export default function AboutPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-24 sm:flex-row sm:gap-12">
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {aboutContent.heading}
        </h1>
        {aboutContent.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lg text-zinc-600 dark:text-zinc-400">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:w-48 sm:shrink-0">
        <h2 className="text-sm font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
          Stack
        </h2>
        <ul className="flex flex-wrap gap-2 sm:flex-col">
          {aboutContent.stack.map((tech) => (
            <li
              key={tech}
              className="w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
