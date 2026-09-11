import { aboutContent } from "@/lib/mock-data";

export default function AboutPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">
        {aboutContent.heading}
      </h1>
      {aboutContent.paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-lg text-zinc-600 dark:text-zinc-400">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
