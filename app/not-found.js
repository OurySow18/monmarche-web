import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-sm text-center">
        <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold">
          Monmarché
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
          Page introuvable
        </h1>
        <p className="mt-4 text-gray-600">
          Le lien demandé est invalide, expiré ou n&apos;est plus disponible.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[#ff6f00] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}
