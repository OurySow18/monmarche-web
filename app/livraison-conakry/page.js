import Link from "next/link";
import { COMMUNES } from "@/lib/conakry";
import { CATEGORIES } from "@/lib/catalog";
import { SITE_URL } from "@/app/p/product-service";

const url = `${SITE_URL}/livraison-conakry`;

export const metadata = {
  title: "Livraison à domicile en Guinée et à Conakry : toutes les communes et quartiers",
  description:
    "Monmarché livre vos achats en ligne à Kaloum, Dixinn, Matam, Ratoma et Matoto. Commandez épicerie, mode, beauté et électronique, livrés chez vous à Conakry.",
  alternates: { canonical: url },
};

export default function LivraisonConakryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Livraison à domicile Monmarché",
    serviceType: "Livraison de produits achetés en ligne",
    provider: { "@type": "Organization", name: "Monmarché", url: SITE_URL },
    areaServed: COMMUNES.map((commune) => ({
      "@type": "AdministrativeArea",
      name: `${commune.name}, Conakry, Guinée`,
    })),
    url,
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Livraison à domicile partout à Conakry
        </h1>
        <p className="text-gray-700 max-w-3xl">
          Monmarché est une marketplace guinéenne : vous achetez en ligne auprès de
          plusieurs vendeurs, dans un seul panier, et nous livrons votre commande à
          domicile dans les cinq communes de Conakry. Les frais de livraison sont
          affichés dans l&apos;application avant la validation de la commande.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Communes desservies</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {COMMUNES.map((commune) => (
            <li key={commune.slug}>
              <Link
                href={`/livraison-conakry/${commune.slug}`}
                className="block h-full rounded-2xl border border-orange-100 p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-primary">
                  Livraison à {commune.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {commune.quartiers.slice(0, 6).join(", ")}…
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Comment commander ?</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>Téléchargez l&apos;application Monmarché sur Android ou iPhone.</li>
          <li>Choisissez vos produits chez un ou plusieurs vendeurs.</li>
          <li>Indiquez votre adresse et votre quartier à Conakry.</li>
          <li>Payez en ligne ou à la livraison, puis suivez votre commande.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">Que peut-on se faire livrer ?</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/categorie/${category.slug}`}
              className="rounded-full border border-orange-200 px-4 py-1.5 text-sm hover:bg-orange-50"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
