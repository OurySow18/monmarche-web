import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Produit introuvable
      </h1>
      <p className="mt-4 text-gray-600">
        Ce produit n’existe pas ou n’est plus disponible. Retournez à l’accueil
        pour découvrir nos sélections.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#ff6f00] px-6 py-3 text-white font-semibold hover:bg-orange-600"
        >
          Aller à l’accueil
        </Link>
      </div>
    </section>
  );
}
