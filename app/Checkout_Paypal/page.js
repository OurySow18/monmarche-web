import Link from "next/link";

export const metadata = {
  title: "Checkout PayPal — Monmarché",
  description: "Finalisez votre paiement PayPal.",
};

export default function CheckoutPaypalPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-orange-100 bg-white shadow-md p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Checkout PayPal
        </h1>
        <p className="mt-4 text-gray-600">
          Cette page sert de point de départ pour le paiement PayPal.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          TODO: intégrer le flux PayPal côté serveur si nécessaire.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#ff6f00] px-6 py-3 text-white font-semibold hover:bg-orange-600"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
