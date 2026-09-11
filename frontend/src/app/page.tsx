import Link from "next/link";
import { profile } from "@/lib/mock-data";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {profile.title}
      </h1>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        {profile.intro}
      </p>
      <Link
        href="/projects"
        className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Voir mes projets
      </Link>
    </section>
  );
}
