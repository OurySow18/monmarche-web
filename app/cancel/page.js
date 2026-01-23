import Link from "next/link";

export default function OrangeCancelPage({ searchParams }) {
  const reason = searchParams?.reason || searchParams?.error;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Paiement annulé
      </h1>
      <p className="mt-4 text-gray-600">
        Votre paiement Orange Money a été annulé. Vous pouvez réessayer à tout
        moment.
      </p>
      {reason && <p className="mt-4 text-sm text-gray-500">Raison : {reason}</p>}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#ff6f00] px-6 py-3 text-white font-semibold hover:bg-orange-600"
        >
          Retour à l’accueil
        </Link>
      </div>
    </section>
  );
}
