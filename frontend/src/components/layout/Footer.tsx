export function Footer() {
  return (
    <footer className="border-t-2 border-border px-6 py-6 text-center font-mono text-xs tracking-wide text-muted">
      <span className="text-accent">©</span> {new Date().getFullYear()} Portfolio —
      construit avec Next.js et Spring Boot.
    </footer>
  );
}
