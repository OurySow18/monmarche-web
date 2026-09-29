import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppCTA, CategoryIcon, FaqList, PageHero, TrustBar } from "@/app/_components/Marketing";
import StoreButtons from "@/app/_components/StoreButtons";
import { GUIDES, getGuide } from "@/lib/guides";
import { CATEGORIES } from "@/lib/catalog";
import { COMMUNES } from "@/lib/conakry";
import { SITE_URL } from "@/app/p/product-service";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/app-links";

// Seuls les guides listés existent : toute autre URL à la racine renvoie 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ guide: guide.slug }));
}

export function generateMetadata({ params }) {
  const guide = getGuide(params.guide);
  if (!guide) return {};
  const url = `${SITE_URL}/${guide.slug}`;
  return {
    title: { absolute: `${guide.title} | Monmarché` },
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      siteName: "Monmarché",
      type: "article",
    },
  };
}

export default function GuidePage({ params }) {
  const guide = getGuide(params.guide);
  if (!guide) notFound();

  const url = `${SITE_URL}/${guide.slug}`;
  const isSellerGuide = guide.slug === "vendre-en-ligne-guinee";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
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
        { "@type": "ListItem", position: 2, name: guide.h1, item: url },
      ],
    },
    ...(guide.appButtons
      ? [
          {
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: "Monmarché",
            operatingSystem: "Android, iOS",
            applicationCategory: "ShoppingApplication",
            offers: { "@type": "Offer", price: 0, priceCurrency: "GNF" },
            downloadUrl: [PLAY_STORE_URL, APP_STORE_URL],
          },
        ]
      : []),
  ];

  return (
    <article className="max-w-6xl mx-auto space-y-12">
      <PageHero
        eyebrow="Guide Monmarché · Guinée"
        icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
        title={guide.h1}
        subtitle={guide.intro}
      >
        {isSellerGuide ? (
          <a href="https://monmarchebusiness.com" target="_blank" rel="noopener" className="inline-block">
            <Button className="bg-white px-6 py-6 text-base font-bold text-primary hover:bg-orange-50">
              Ouvrir ma boutique
            </Button>
          </a>
        ) : (
          <StoreButtons variant="light" />
        )}
      </PageHero>

      {isSellerGuide ? null : <TrustBar />}

      <div className="space-y-6">
        {guide.sections.map((section) => (
          <section
            key={section.h2}
            className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm"
          >
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{section.h2}</h2>
            {section.paragraphs?.map((text) => (
              <p key={text} className="text-gray-700">{text}</p>
            ))}
            {section.list ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.steps ? (
              <ol className="space-y-3">
                {section.steps.map((item, index) => (
                  <li key={item} className="flex gap-3 text-gray-700">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            ) : null}
            {section.link ? (
              <a href={section.link.href} target="_blank" rel="noopener" className="inline-block">
                <Button className="px-6 py-3">{section.link.label}</Button>
              </a>
            ) : null}
            {section.categories ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categorie/${category.slug}`}
                    className="group flex flex-col items-center gap-2 rounded-2xl bg-orange-50 p-4 text-center text-sm font-semibold text-gray-900 hover:bg-primary hover:text-white"
                  >
                    <CategoryIcon slug={category.slug} className="h-6 w-6 text-primary group-hover:text-white" />
                    {category.short}
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      <section className="rounded-3xl bg-orange-50 p-6 sm:p-10 space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Partout à Conakry, dans votre quartier
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {COMMUNES.map((commune) => (
            <li key={commune.slug}>
              <Link
                href={`/livraison-conakry/${commune.slug}`}
                className="group block h-full rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="inline-flex items-center gap-1.5 font-bold text-gray-900 group-hover:text-primary">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  {commune.name}
                </span>
                <span className="mt-1 block text-sm text-gray-600">{commune.quartiers.join(", ")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FaqList faq={guide.faq} />

      {isSellerGuide ? null : <AppCTA />}

      <nav className="space-y-3" aria-label="Autres guides">
        <h2 className="text-lg font-bold text-gray-900">À lire aussi</h2>
        <div className="flex flex-wrap gap-2">
          {GUIDES.filter((other) => other.slug !== guide.slug).map((other) => (
            <Link
              key={other.slug}
              href={`/${other.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-4 py-2 text-sm hover:border-orange-200 hover:text-primary"
            >
              {other.nav} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
          <Link
            href="/livraison-conakry"
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-4 py-2 text-sm hover:border-orange-200 hover:text-primary"
          >
            Livraison à Conakry <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </nav>
      {/* Données structurées en dernier : un <script> en tête décale le contenu (space-y). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
