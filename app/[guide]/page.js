import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GUIDES, getGuide } from "@/lib/guides";
import { CATEGORIES } from "@/lib/catalog";
import { COMMUNES } from "@/lib/conakry";
import { SITE_URL } from "@/app/p/product-service";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/app/p/fallback-content";

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

function Pill({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-orange-200 px-4 py-1.5 text-sm hover:bg-orange-50"
    >
      {children}
    </Link>
  );
}

export default function GuidePage({ params }) {
  const guide = getGuide(params.guide);
  if (!guide) notFound();

  const url = `${SITE_URL}/${guide.slug}`;
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
    <article className="max-w-4xl mx-auto py-6 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{guide.h1}</h1>
        <p className="text-lg text-gray-700">{guide.intro}</p>
        {guide.appButtons ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Button className="w-full sm:w-auto px-6 py-3">Télécharger sur Android</Button>
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full sm:w-auto px-6 py-3">
                Télécharger sur iPhone
              </Button>
            </a>
          </div>
        ) : null}
      </header>

      {guide.sections.map((section) => (
        <section key={section.h2} className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">{section.h2}</h2>
          {section.paragraphs?.map((text) => (
            <p key={text} className="text-gray-700">{text}</p>
          ))}
          {section.list ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {section.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
          {section.steps ? (
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              {section.steps.map((item) => <li key={item}>{item}</li>)}
            </ol>
          ) : null}
          {section.categories ? (
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Pill key={category.slug} href={`/categorie/${category.slug}`}>
                  {category.name}
                </Pill>
              ))}
            </div>
          ) : null}
        </section>
      ))}

      <section className="rounded-2xl bg-orange-50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Partout à Conakry, dans votre quartier
        </h2>
        <p className="text-gray-700">
          Monmarché livre dans les cinq communes de Conakry. Retrouvez votre quartier :
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          {COMMUNES.map((commune) => (
            <li key={commune.slug}>
              <Link
                href={`/livraison-conakry/${commune.slug}`}
                className="font-semibold text-primary hover:underline"
              >
                {commune.name}
              </Link>{" "}
              : {commune.quartiers.join(", ")}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Questions fréquentes</h2>
        {guide.faq.map((item) => (
          <div key={item.q}>
            <h3 className="font-semibold text-gray-900">{item.q}</h3>
            <p className="text-gray-700">{item.a}</p>
          </div>
        ))}
      </section>

      <nav className="space-y-2" aria-label="Autres guides">
        <h2 className="text-lg font-semibold text-gray-900">À lire aussi</h2>
        <div className="flex flex-wrap gap-2">
          {GUIDES.filter((other) => other.slug !== guide.slug).map((other) => (
            <Pill key={other.slug} href={`/${other.slug}`}>{other.nav}</Pill>
          ))}
          <Pill href="/livraison-conakry">Livraison à Conakry</Pill>
        </div>
      </nav>
    </article>
  );
}
