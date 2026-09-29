import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/app/_components/ProductGrid";
import { formatPrice } from "@/lib/catalog";
import { COMMUNES } from "@/lib/conakry";
import { SITE_URL } from "./product-service";
import { APP_STORE_URL, PLAY_STORE_URL } from "./fallback-content";

export default function ProductView({ product, category, related }) {
  const deepLink = `monmarche://p/${product.id}`;
  const price = formatPrice(product.price, product.currency);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      image: [product.image],
      description: product.description || product.title,
      url: product.url,
      sku: product.id,
      ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
      ...(category ? { category: category.name } : {}),
      ...(product.price
        ? {
            offers: {
              "@type": "Offer",
              url: product.url,
              price: product.price,
              priceCurrency: product.currency || "GNF",
              availability: "https://schema.org/InStock",
              areaServed: { "@type": "City", name: "Conakry" },
              ...(product.vendorName
                ? { seller: { "@type": "Organization", name: product.vendorName } }
                : {}),
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        ...(category
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: category.name,
                item: `${SITE_URL}/categorie/${category.slug}`,
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: category ? 3 : 2,
          name: product.title,
          item: product.url,
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-gray-500" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-primary">Accueil</Link> ›{" "}
        {category ? (
          <>
            <Link href={`/categorie/${category.slug}`} className="hover:text-primary">
              {category.name}
            </Link>{" "}
            ›{" "}
          </>
        ) : null}
        <span className="text-gray-800">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-orange-100 bg-orange-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            {price ? <p className="text-2xl font-bold text-primary">{price}</p> : null}
            {product.vendorName ? (
              <p className="text-sm text-gray-600">
                Vendu par{" "}
                {product.vendorId ? (
                  <Link href={`/vendor/${product.vendorId}`} className="text-primary hover:underline">
                    {product.vendorName}
                  </Link>
                ) : (
                  product.vendorName
                )}
              </p>
            ) : null}
          </div>

          {product.description ? (
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          ) : null}

          <p className="text-sm text-gray-700 rounded-xl bg-orange-50 p-4">
            Livraison à domicile partout à Conakry :{" "}
            {COMMUNES.map((commune, index) => (
              <span key={commune.slug}>
                <Link href={`/livraison-conakry/${commune.slug}`} className="text-primary hover:underline">
                  {commune.name}
                </Link>
                {index < COMMUNES.length - 1 ? ", " : "."}
              </span>
            ))}{" "}
            Paiement en ligne ou à la livraison.
          </p>

          <div className="space-y-3">
            <a href={deepLink} className="block">
              <Button className="w-full bg-primary text-white hover:bg-primary/90 text-base py-3">
                Commander dans l’app Monmarché
              </Button>
            </a>
            <div className="flex gap-3">
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  App Store
                </Button>
              </a>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  Play Store
                </Button>
              </a>
            </div>
            <p className="text-xs text-gray-500">
              Si l’application ne s’ouvre pas, installez-la ou mettez-la à jour puis réessayez.
            </p>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? `Autres produits : ${category.name}` : "Autres produits"}
          </h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
