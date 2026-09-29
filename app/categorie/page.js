import Link from "next/link";
import { CATEGORIES, listPublicProducts } from "@/lib/catalog";
import { SITE_URL } from "@/app/p/product-service";

export const revalidate = 3600;

export const metadata = {
  title: "Toutes les catégories : acheter en ligne en Guinée",
  description:
    "Épicerie, mode, beauté, maison, bébé, électronique : parcourez les produits des vendeurs de Monmarché, livrés partout à Conakry.",
  alternates: { canonical: `${SITE_URL}/categorie` },
};

export default async function CategoriesPage() {
  const products = await listPublicProducts();
  const counts = products.reduce((acc, product) => {
    acc[product.categorySlug] = (acc[product.categorySlug] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Acheter en ligne en Guinée : toutes les catégories
        </h1>
        <p className="text-gray-700 max-w-3xl">
          Monmarché réunit des vendeurs guinéens dans une seule application. Trouvez
          un produit, comparez les prix en francs guinéens et faites-vous livrer à
          domicile partout à Conakry.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/categorie/${category.slug}`}
              className="block h-full rounded-2xl border border-orange-100 p-5 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold text-primary">{category.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{category.intro}</p>
              <p className="text-xs text-gray-500 mt-2">
                {counts[category.slug] || 0} produit{(counts[category.slug] || 0) > 1 ? "s" : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
