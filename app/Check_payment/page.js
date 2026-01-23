import Link from "next/link";

export default function PayPalReturnPage({ searchParams }) {
  const status = searchParams?.status || searchParams?.payment_status;
  const txn = searchParams?.txn_id || searchParams?.transaction_id;
  const orderId = searchParams?.order_id || searchParams?.invoice;

  const isSuccess =
    status?.toLowerCase?.() === "success" ||
    status?.toLowerCase?.() === "completed";

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        {isSuccess ? "Paiement PayPal confirmé" : "Paiement PayPal en attente"}
      </h1>
      <p className="mt-4 text-gray-600">
        {isSuccess
          ? "Votre paiement a été reçu."
          : "Nous vérifions votre paiement. Vous recevrez une confirmation."}
      </p>
      <div className="mt-6 text-sm text-gray-500 space-y-2">
        {txn && <p>Transaction : {txn}</p>}
        {orderId && <p>Commande : {orderId}</p>}
        {status && <p>Statut : {status}</p>}
      </div>
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
