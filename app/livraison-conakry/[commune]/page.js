import Link from "next/link";
import { notFound } from "next/navigation";
import { COMMUNES, getCommune } from "@/lib/conakry";
import { CATEGORIES } from "@/lib/catalog";
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
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-gray-500" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-primary">Accueil</Link> ›{" "}
        <Link href="/livraison-conakry" className="hover:text-primary">Livraison à Conakry</Link> ›{" "}
        <span className="text-gray-800">{commune.name}</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Achat en ligne et livraison à {commune.name}
        </h1>
        <p className="text-gray-700">
          {commune.name} est {commune.description}. Avec Monmarché, vous commandez en
          ligne auprès de vendeurs guinéens et recevez vos achats directement chez vous
          ou au bureau, où que vous soyez dans la commune.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          Quartiers livrés à {commune.name}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
          {commune.quartiers.map((quartier) => (
            <li key={quartier} className="rounded-lg bg-orange-50 px-3 py-2">
              {quartier}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
          Votre quartier n&apos;est pas dans la liste ? Nous livrons dans toute la commune :
          indiquez simplement votre adresse dans l&apos;application.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          Produits disponibles à la livraison
        </h2>
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

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Questions fréquentes</h2>
        {faq.map((item) => (
          <div key={item.q}>
            <h3 className="font-semibold text-gray-900">{item.q}</h3>
            <p className="text-gray-700">{item.a}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Autres communes de Conakry</h2>
        <div className="flex flex-wrap gap-3">
          {COMMUNES.filter((other) => other.slug !== commune.slug).map((other) => (
            <Link
              key={other.slug}
              href={`/livraison-conakry/${other.slug}`}
              className="text-primary hover:underline"
            >
              Livraison à {other.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
