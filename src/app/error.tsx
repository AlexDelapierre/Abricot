"use client";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl">Une erreur est survenue</h1>
      <p>Veuillez réessayer dans quelques instants.</p>
      <button
        type="button"
        onClick={retry}
        className="rounded-card bg-grey-950 px-4 py-3 text-white"
      >
        Réessayer
      </button>
    </main>
  );
}
