import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { AppCTA, CategoryIcon, FaqList, PageHero, TrustBar } from "@/app/_components/Marketing";
import StoreButtons from "@/app/_components/StoreButtons";
import { COMMUNES, getCommune } from "@/lib/conakry";
import { CATEGORIES } from "@/lib/catalog";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/app/p/product-service";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMMUNES.map((commune) => ({ commune: commune.slug }));
}

export function generateMetadata({ params }) {
  const commune = getCommune(params.commune);
  if (!commune) return {};
  const quartiers = commune.quartiers.slice(0, 4).join(", ");
  return {
    title: `Livraison à ${commune.name}, Conakry : achat en ligne livré à domicile`,
    description: `Faites-vous livrer vos achats en ligne à ${commune.name} (${quartiers}…) avec Monmarché : épicerie, mode, beauté, maison et électronique.`,
    alternates: { canonical: `${SITE_URL}/livraison-conakry/${commune.slug}` },
  };
}

export default function CommunePage({ params }) {
  const commune = getCommune(params.commune);
  if (!commune) notFound();

  const url = `${SITE_URL}/livraison-conakry/${commune.slug}`;
  const faq = [
    {
      q: `Monmarché livre-t-il à ${commune.name} ?`,
      a: `Oui. Monmarché livre dans toute la commune de ${commune.name}, notamment à ${commune.quartiers.join(", ")}.`,
    },
    {
      q: `Comment commander en ligne à ${commune.name} ?`,
      a: "Téléchargez l'application Monmarché, ajoutez vos produits au panier, indiquez votre adresse et votre quartier, puis payez en ligne ou à la livraison.",
    },
    {
      q: `Comment payer en ligne à ${commune.name} ?`,
      a: "Vous pouvez payer par Orange Money, par virement bancaire ou à la livraison, en espèces ou par paiement mobile.",
    },
    {
      q: "Combien coûte la livraison ?",
      a: "Les frais de livraison dépendent de votre adresse et de votre commande. Ils sont toujours affichés dans l'application avant la validation.",
    },
    {
      q: `Que peut-on acheter et se faire livrer à ${commune.name} ?`,
      a: `Des produits d'épicerie, de la mode, des produits de beauté, des articles pour la maison et pour bébé, de l'électronique et plus encore, vendus par des commerçants guinéens.`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Livraison à Conakry", item: `${SITE_URL}/livraison-conakry` },
        { "@type": "ListItem", position: 3, name: commune.name, item: url },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <nav className="text-sm text-gray-500" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-primary">Accueil</Link> ›{" "}
        <Link href="/livraison-conakry" className="hover:text-primary">Livraison à Conakry</Link> ›{" "}
        <span className="text-gray-800">{commune.name}</span>
      </nav>

      <PageHero
        eyebrow={`Conakry · ${commune.quartiers.length} quartiers livrés`}
        icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
        title={`Achat en ligne et livraison à ${commune.name}`}
        subtitle={`${commune.name} est ${commune.description}. Avec Monmarché, vous commandez en ligne auprès de vendeurs guinéens et recevez vos achats chez vous ou au bureau, où que vous soyez dans la commune.`}
      >
        <StoreButtons variant="light" />
      </PageHero>

      <TrustBar />

      <section className="space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Quartiers livrés à {commune.name}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {commune.quartiers.map((quartier) => (
            <li
              key={quartier}
              className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm"
            >
              <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {quartier}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
          Votre quartier n&apos;est pas dans la liste ? Nous livrons dans toute la commune :
          indiquez simplement votre adresse dans l&apos;application.
        </p>
      </section>

      <section className="rounded-3xl bg-orange-50 p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Acheter, payer et vendre en ligne à {commune.name}
          </h2>
          <p className="text-gray-700">
            Que vous habitiez à {commune.quartiers.slice(0, 3).join(", ")} ou ailleurs à{" "}
            {commune.name}, l&apos;application Monmarché vous permet d&apos;acheter en ligne,
            de payer par Orange Money ou à la livraison, et même de vendre vos propres
            produits si vous êtes commerçant.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/categorie/${category.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm hover:text-primary"
            >
              <CategoryIcon slug={category.slug} className="h-4 w-4 text-primary" />
              {category.short}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/${guide.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
            >
              {guide.nav} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <FaqList faq={faq} />

      <AppCTA title={`Commandez maintenant, livré à ${commune.name}`} />

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Autres communes de Conakry</h2>
        <div className="flex flex-wrap gap-2">
          {COMMUNES.filter((other) => other.slug !== commune.slug).map((other) => (
            <Link
              key={other.slug}
              href={`/livraison-conakry/${other.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm hover:border-orange-200 hover:text-primary"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Livraison à {other.name}
            </Link>
          ))}
        </div>
      </section>
      {/* Données structurées en dernier : un <script> en tête décale le contenu (space-y). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
