import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, Store, Truck, Wallet } from "lucide-react";
import ProductGrid from "@/app/_components/ProductGrid";
import StoreButtons from "@/app/_components/StoreButtons";
import { AppCTA, CategoryIcon } from "@/app/_components/Marketing";
import { formatPrice } from "@/lib/catalog";
import { COMMUNES } from "@/lib/conakry";
import { SITE_URL } from "./product-service";

const PRODUCT_TRUST = [
  { icon: Truck, text: "Livraison à domicile partout à Conakry" },
  { icon: Wallet, text: "Orange Money, virement ou paiement à la livraison" },
  { icon: BadgeCheck, text: "Vendeur vérifié par Monmarché" },
];

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
    <div className="max-w-6xl mx-auto space-y-12">
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

      <div className="grid gap-8 lg:gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-orange-50 shadow-sm ring-1 ring-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          {category ? (
            <Link
              href={`/categorie/${category.slug}`}
              className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow backdrop-blur hover:text-primary"
            >
              <CategoryIcon slug={category.slug} className="h-3.5 w-3.5 text-primary" />
              {category.short}
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">
              {product.title}
            </h1>
            {price ? <p className="text-3xl font-extrabold text-primary">{price}</p> : null}
            {product.vendorName ? (
              <p className="inline-flex items-center gap-2 text-sm text-gray-600">
                <Store className="h-4 w-4 text-primary" aria-hidden="true" />
                Vendu par{" "}
                {product.vendorId ? (
                  <Link
                    href={`/vendor/${product.vendorId}`}
                    className="font-semibold text-gray-900 hover:text-primary hover:underline"
                  >
                    {product.vendorName}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-900">{product.vendorName}</span>
                )}
              </p>
            ) : null}
          </div>

          <div className="space-y-3 rounded-3xl bg-orange-50 p-5">
            <a
              href={deepLink}
              className="flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-4 text-center text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Commander dans l’app Monmarché
            </a>
            <p className="text-center text-xs text-gray-600">
              Pas encore l’application ? Installez-la gratuitement :
            </p>
            <StoreButtons className="justify-center" />
          </div>

          <ul className="space-y-2">
            {PRODUCT_TRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          {product.description ? (
            <section className="space-y-2 border-t border-gray-100 pt-5">
              <h2 className="text-lg font-bold text-gray-900">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </section>
          ) : null}

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-gray-100 pt-5 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            Livré à
            {COMMUNES.map((commune, index) => (
              <span key={commune.slug}>
                <Link href={`/livraison-conakry/${commune.slug}`} className="text-primary hover:underline">
                  {commune.name}
                </Link>
                {index < COMMUNES.length - 1 ? "," : ""}
              </span>
            ))}
          </p>
        </div>
      </div>

      {related.length ? (
        <section className="space-y-5">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {category ? `Vous aimerez aussi : ${category.name.toLowerCase()}` : "Vous aimerez aussi"}
          </h2>
          <ProductGrid products={related} />
        </section>
      ) : null}

      <AppCTA
        title="Des centaines d'autres produits vous attendent"
        images={related.slice(0, 4).map((item) => item.image)}
      />

      {/* Barre d'achat fixe sur mobile ; remplace MobileAppBar sur les fiches produit. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <a
          href={deepLink}
          className="flex items-center justify-between gap-3 rounded-2xl bg-primary px-5 py-3 text-white shadow-xl"
        >
          <span className="min-w-0">
            <span className="block truncate text-xs text-white/80">{product.title}</span>
            {price ? <span className="block text-lg font-extrabold">{price}</span> : null}
          </span>
          <span className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary">
            Commander
          </span>
        </a>
      </div>
      {/* Données structurées en dernier : un <script> en tête décale le contenu (space-y). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
