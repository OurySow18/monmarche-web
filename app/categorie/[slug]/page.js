import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import ProductGrid from "@/app/_components/ProductGrid";
import { AppCTA, CategoryIcon, PageHero, TrustBar } from "@/app/_components/Marketing";
import StoreButtons from "@/app/_components/StoreButtons";
import { CATEGORIES, getCategory, listProductsByCategory } from "@/lib/catalog";
import { COMMUNES } from "@/lib/conakry";
import { SITE_URL } from "@/app/p/product-service";

export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }) {
  const category = getCategory(params.slug);
  if (!category) return {};
  const title = `${category.name} : acheter en ligne à Conakry, Guinée`;
  const url = `${SITE_URL}/categorie/${category.slug}`;
  return {
    title,
    description: `${category.intro} Paiement en ligne ou à la livraison.`.slice(0, 160),
    alternates: { canonical: url },
    openGraph: { title, description: category.intro, url, siteName: "Monmarché", type: "website" },
  };
}

export default async function CategoryPage({ params }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const products = await listProductsByCategory(category.slug);
  const url = `${SITE_URL}/categorie/${category.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      description: category.intro,
      url,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: products.length,
        itemListElement: products.slice(0, 100).map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: product.url,
          name: product.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Catégories", item: `${SITE_URL}/categorie` },
        { "@type": "ListItem", position: 3, name: category.name, item: url },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <nav className="text-sm text-gray-500" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-primary">Accueil</Link> ›{" "}
        <Link href="/categorie" className="hover:text-primary">Catégories</Link> ›{" "}
        <span className="text-gray-800">{category.name}</span>
      </nav>

      <PageHero
        eyebrow={`${products.length} produit${products.length > 1 ? "s" : ""} disponible${products.length > 1 ? "s" : ""}`}
        icon={<CategoryIcon slug={category.slug} className="h-4 w-4" />}
        title={`${category.name} à Conakry`}
        subtitle={category.intro}
      >
        <StoreButtons variant="light" />
      </PageHero>

      <TrustBar />

      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl bg-orange-50 p-6 text-gray-700">
          Aucun produit publié dans cette catégorie pour le moment. Téléchargez
          l&apos;application pour être parmi les premiers à découvrir les nouveautés !
        </p>
      )}

      <AppCTA
        title={`Commandez vos articles ${category.short.toLowerCase()} dans l'app`}
        images={products.slice(0, 4).map((product) => product.image)}
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 p-6 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            Livraison dans toutes les communes de Conakry
          </h2>
          <div className="flex flex-wrap gap-2">
            {COMMUNES.map((commune) => (
              <Link
                key={commune.slug}
                href={`/livraison-conakry/${commune.slug}`}
                className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-sm text-gray-800 hover:text-primary"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {commune.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 p-6 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Autres catégories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter((other) => other.slug !== category.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/categorie/${other.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm hover:border-orange-200 hover:text-primary"
              >
                <CategoryIcon slug={other.slug} className="h-3.5 w-3.5" />
                {other.short}
              </Link>
            ))}
          </div>
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
