export function Footer() {
  return (
    <footer className="border-t border-black/[.08] px-6 py-6 text-center text-sm text-zinc-500 dark:border-white/[.145] dark:text-zinc-500">
      <span className="text-accent">©</span> {new Date().getFullYear()} Portfolio —
      construit avec Next.js et Spring Boot.
    </footer>
  );
}
