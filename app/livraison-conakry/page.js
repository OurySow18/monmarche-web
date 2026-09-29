import Link from "next/link";
import { ArrowRight, CreditCard, MapPin, Package, ShoppingCart, Smartphone, Truck } from "lucide-react";
import { COMMUNES } from "@/lib/conakry";
import { CATEGORIES } from "@/lib/catalog";
import { AppCTA, CategoryIcon, PageHero, TrustBar } from "@/app/_components/Marketing";
import StoreButtons from "@/app/_components/StoreButtons";
import { SITE_URL } from "@/app/p/product-service";

const url = `${SITE_URL}/livraison-conakry`;

export const metadata = {
  title: "Livraison à domicile en Guinée et à Conakry : toutes les communes et quartiers",
  description:
    "Monmarché livre vos achats en ligne à Kaloum, Dixinn, Matam, Ratoma et Matoto. Commandez épicerie, mode, beauté et électronique, livrés chez vous à Conakry.",
  alternates: { canonical: url },
};

const STEPS = [
  { icon: Smartphone, text: "Téléchargez l'application Monmarché sur Android ou iPhone." },
  { icon: ShoppingCart, text: "Choisissez vos produits chez un ou plusieurs vendeurs." },
  { icon: MapPin, text: "Indiquez votre adresse et votre quartier à Conakry." },
  { icon: CreditCard, text: "Payez par Orange Money, virement ou à la livraison." },
  { icon: Package, text: "Suivez votre commande jusqu'à votre porte." },
];

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
    <div className="max-w-6xl mx-auto space-y-12">
      <PageHero
        eyebrow="5 communes · tout Conakry"
        icon={<Truck className="h-4 w-4" aria-hidden="true" />}
        title="Livraison à domicile partout à Conakry"
        subtitle="Achetez en ligne auprès de plusieurs vendeurs guinéens, dans un seul panier : nous livrons votre commande chez vous ou au bureau. Les frais de livraison sont affichés avant la validation."
      >
        <StoreButtons variant="light" />
      </PageHero>

      <TrustBar />

      <section className="space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Communes desservies</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNES.map((commune) => (
            <li key={commune.slug}>
              <Link
                href={`/livraison-conakry/${commune.slug}`}
                className="group flex h-full flex-col gap-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-lg font-bold text-gray-900">Livraison à {commune.name}</span>
                </span>
                <span className="text-sm text-gray-600">
                  {commune.quartiers.slice(0, 6).join(", ")}…
                </span>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {commune.quartiers.length} quartiers <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-orange-50 p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Comment commander ?</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(({ icon: Icon, text }, index) => (
            <li key={text} className="rounded-2xl bg-white p-5 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-2xl font-extrabold text-orange-200">{index + 1}</span>
              </span>
              <p className="mt-3 text-sm text-gray-700">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Que peut-on se faire livrer ?</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/categorie/${category.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm hover:border-orange-200 hover:text-primary"
            >
              <CategoryIcon slug={category.slug} className="h-4 w-4 text-primary" />
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <AppCTA />
      {/* Données structurées en dernier : un <script> en tête décale le contenu (space-y). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
