import Link from "next/link";

export default function OrangeReturnPage({ searchParams }) {
  const status = searchParams?.status || "success";
  const transactionId = searchParams?.transaction_id || searchParams?.txid;
  const orderId = searchParams?.order_id;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Paiement réussi
      </h1>
      <p className="mt-4 text-gray-600">
        Merci ! Votre paiement Orange Money a été confirmé.
      </p>
      <div className="mt-6 text-sm text-gray-500 space-y-2">
        {transactionId && <p>Transaction : {transactionId}</p>}
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
