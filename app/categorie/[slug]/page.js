import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/app/_components/ProductGrid";
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
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-gray-500" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-primary">Accueil</Link> ›{" "}
        <Link href="/categorie" className="hover:text-primary">Catégories</Link> ›{" "}
        <span className="text-gray-800">{category.name}</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {category.name} à Conakry
        </h1>
        <p className="text-gray-700 max-w-3xl">{category.intro}</p>
        <p className="text-sm text-gray-500">
          {products.length} produit{products.length > 1 ? "s" : ""} disponible
          {products.length > 1 ? "s" : ""} chez des vendeurs guinéens.
        </p>
      </header>

      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-gray-600">
          Aucun produit publié dans cette catégorie pour le moment. Revenez bientôt !
        </p>
      )}

      <section className="rounded-2xl bg-orange-50 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">
          Livraison dans toutes les communes de Conakry
        </h2>
        <p className="text-gray-700">
          Commandez dans l&apos;application Monmarché et faites-vous livrer à{" "}
          {COMMUNES.map((commune, index) => (
            <span key={commune.slug}>
              <Link href={`/livraison-conakry/${commune.slug}`} className="text-primary hover:underline">
                {commune.name}
              </Link>
              {index < COMMUNES.length - 2 ? ", " : index === COMMUNES.length - 2 ? " et " : "."}
            </span>
          ))}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Autres catégories</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((other) => other.slug !== category.slug).map((other) => (
            <Link
              key={other.slug}
              href={`/categorie/${other.slug}`}
              className="rounded-full border border-orange-200 px-4 py-1.5 text-sm hover:bg-orange-50"
            >
              {other.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
