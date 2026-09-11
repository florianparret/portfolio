import Image from "next/image";
import Link from "next/link";
import { profile } from "@/lib/mock-data";

export default function Home() {
  return (
    <section className="flex flex-1 flex-col bg-linear-to-br from-zinc-900 via-zinc-800 to-black text-zinc-50">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-8 px-6 py-24 text-center sm:flex-row sm:items-center sm:text-left">
        <Image
          src="/portrait.png"
          alt={profile.name}
          width={160}
          height={160}
          priority
          className="h-40 w-40 shrink-0 rounded-full object-cover ring-2 ring-white/10"
        />
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {profile.name}
          </h1>
          <p className="text-lg font-medium text-zinc-300">{profile.title}</p>
          <p className="max-w-xl text-zinc-400">{profile.intro}</p>
          <Link
            href="/projects"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Voir mes projets
          </Link>
        </div>
      </div>
    </section>
  );
}
