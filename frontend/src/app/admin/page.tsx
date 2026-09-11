import { LogoutButton } from "./LogoutButton";

export default function AdminPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">Espace admin</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Connecté. La gestion des projets (créer, modifier, supprimer) arrivera
        dans un prochain ticket.
      </p>
      <LogoutButton />
    </section>
  );
}
