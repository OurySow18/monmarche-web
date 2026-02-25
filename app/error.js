"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-sm text-center">
        <p className="text-xs uppercase tracking-wide text-red-600 font-semibold">
          Monmarché
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
          Une erreur est survenue
        </h1>
        <p className="mt-4 text-gray-600">
          Nous n&apos;avons pas pu afficher cette page pour le moment. Vous pouvez
          réessayer ou revenir à l&apos;accueil.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex rounded-full bg-[#ff6f00] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex rounded-full border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-50"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
