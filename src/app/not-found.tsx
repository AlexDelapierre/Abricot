import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl">Page introuvable</h1>
      <p>La page demandée est introuvable.</p>
      <Link
        href="/dashboard"
        className="rounded-card bg-grey-950 px-4 py-3 text-white"
      >
        Retour au tableau de bord
      </Link>
    </main>
  );
}
