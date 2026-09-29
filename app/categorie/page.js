import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppCTA, CategoryIcon, PageHero, TrustBar } from "@/app/_components/Marketing";
import StoreButtons from "@/app/_components/StoreButtons";
import { CATEGORIES, listPublicProducts, pickFeatured } from "@/lib/catalog";
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
  const byCategory = products.reduce((acc, product) => {
    (acc[product.categorySlug] ||= []).push(product);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <PageHero
        eyebrow={`${products.length} produits · ${CATEGORIES.length} catégories`}
        title="Acheter en ligne en Guinée : toutes les catégories"
        subtitle="Monmarché réunit des vendeurs guinéens dans une seule application. Trouvez un produit, comparez les prix en francs guinéens et faites-vous livrer partout à Conakry."
      >
        <StoreButtons variant="light" />
      </PageHero>

      <TrustBar />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const items = byCategory[category.slug] || [];
          const previews = pickFeatured(items, 3);
          return (
            <li key={category.slug}>
              <Link
                href={`/categorie/${category.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="grid h-32 grid-cols-3 gap-0.5 bg-orange-50">
                  {previews.length ? (
                    previews.map((product) => (
                      <div key={product.url} className="relative overflow-hidden">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="150px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 flex items-center justify-center text-primary">
                      <CategoryIcon slug={category.slug} className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-primary">
                      <CategoryIcon slug={category.slug} className="h-5 w-5" />
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary">
                      {category.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{category.intro}</p>
                  <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">
                    {items.length} produit{items.length > 1 ? "s" : ""}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <AppCTA images={pickFeatured(products, 4).map((product) => product.image)} />
    </div>
  );
}
