import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, ShoppingCart, Truck, PhoneCall, Package, Smartphone, CreditCard } from "lucide-react";
import ShortsGallery from "../components/ui/ShortsGallery";
import VideoPresentation from "@/components/ui/VideoPresentation";
import Hero from "./_components/Hero";
import ProductGrid from "./_components/ProductGrid";
import { AppCTA, CategoryIcon, TrustBar } from "./_components/Marketing";
import { CATEGORIES, listPublicProducts, pickFeatured } from "@/lib/catalog";
import { COMMUNES } from "@/lib/conakry";
import { GUIDES } from "@/lib/guides";

const SITE_URL = "https://monmarchegn.com";

// Les produits mis en avant viennent du catalogue : on le relit toutes les heures.
export const revalidate = 3600;

export const metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Monmarché",
  url: SITE_URL,
  image: `${SITE_URL}/images/og-monmarche.png`,
  email: "infos@monmarchegn.com",
  telephone: "+224 612121229",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cosa",
    addressLocality: "Conakry",
    addressCountry: "GN",
  },
  areaServed: COMMUNES.map((commune) => ({
    "@type": "AdministrativeArea",
    name: `${commune.name}, Conakry`,
  })),
};

const STEPS = [
  {
    icon: Smartphone,
    title: "Téléchargez l'application",
    text: "Gratuite sur Android et iPhone, prête en une minute.",
  },
  {
    icon: ShoppingCart,
    title: "Remplissez votre panier",
    text: "Chez un ou plusieurs vendeurs, avec les prix en GNF.",
  },
  {
    icon: CreditCard,
    title: "Payez comme vous voulez",
    text: "Orange Money, virement ou à la livraison.",
  },
  {
    icon: Package,
    title: "Recevez chez vous",
    text: "Livraison à domicile partout à Conakry.",
  },
];

const FEATURES = [
  {
    icon: ShoppingCart,
    title: "Large sélection de produits",
    description: "Riz, jus, produits laitiers, mode, beauté, électronique et plus encore.",
    slug: "large-selection-produits",
  },
  {
    icon: Truck,
    title: "Livraison rapide",
    description: "Service fiable dans toutes les communes de Conakry.",
    slug: "livraison-rapide",
  },
  {
    icon: ShieldCheck,
    title: "Paiement sécurisé",
    description: "Commandez et payez en toute sécurité en ligne ou à la livraison.",
    slug: "paiement-securise",
  },
  {
    icon: PhoneCall,
    title: "Support dédié",
    description: "Notre équipe répond à vos questions par e-mail et WhatsApp.",
    slug: "support-dedie",
  },
];

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h2>
      </div>
      {action}
      {/* Données structurées en dernier : un <script> en tête décale le contenu (space-y). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
    </div>
  );
}

export default async function HomePage() {
  const recentPosts = getRecentPosts(3);
  const products = await listPublicProducts();
  const featured = pickFeatured(products, 12);
  const heroProducts = featured.slice(0, 4).map(({ url, slug, id, title, image }) => ({
    url,
    slug,
    id,
    title,
    image,
  }));
  const counts = products.reduce((acc, product) => {
    acc[product.categorySlug] = (acc[product.categorySlug] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl space-y-16 sm:space-y-20 text-gray-800">

      <div className="space-y-6">
        <Hero products={heroProducts} productCount={products.length} />
        <TrustBar />
      </div>

      {/* Catégories */}
      <section className="space-y-6">
        <SectionTitle
          eyebrow="Catégories"
          title="Que voulez-vous acheter ?"
          action={
            <Link href="/categorie" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Toutes les catégories <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/categorie/${category.slug}`}
                className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <CategoryIcon slug={category.slug} />
                </span>
                <span className="text-sm font-semibold text-gray-900">{category.short}</span>
                {counts[category.slug] ? (
                  <span className="text-xs text-gray-500">{counts[category.slug]} produits</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Produits */}
      {featured.length ? (
        <section className="space-y-6">
          <SectionTitle
            eyebrow="Nouveautés"
            title="Les produits du moment"
            action={
              <Link href="/categorie" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Voir tout le catalogue <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <ProductGrid products={featured.slice(0, 8)} />
        </section>
      ) : null}

      {/* Comment ça marche */}
      <section className="space-y-8">
        <SectionTitle eyebrow="Simple et rapide" title="Commander en 4 étapes" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="relative rounded-2xl bg-orange-50 p-6">
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-orange-200">
                {index + 1}
              </span>
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="relative mt-4 text-lg font-bold text-gray-900">{title}</h3>
              <p className="relative mt-1 text-sm text-gray-700">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <AppCTA images={featured.slice(4, 8).map((product) => product.image)} />

      {/* Pourquoi Monmarché */}
      <section className="space-y-8">
        <SectionTitle eyebrow="Nos engagements" title="Pourquoi choisir Monmarché ?" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description, slug }) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-primary">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Livraison */}
      <section className="rounded-3xl bg-gray-50 p-6 sm:p-10 space-y-6">
        <SectionTitle
          eyebrow="Zones de livraison"
          title="Livraison dans toutes les communes de Conakry"
          action={
            <Link href="/livraison-conakry" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              En savoir plus <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {COMMUNES.map((commune) => (
            <li key={commune.slug}>
              <Link
                href={`/livraison-conakry/${commune.slug}`}
                className="flex h-full flex-col gap-1 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="inline-flex items-center gap-1.5 font-bold text-gray-900">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  {commune.name}
                </span>
                <span className="text-xs text-gray-500 line-clamp-2">
                  {commune.quartiers.slice(0, 4).join(", ")}…
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/${guide.slug}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm hover:border-orange-200 hover:text-primary"
            >
              {guide.nav}
            </Link>
          ))}
        </div>
      </section>

      <VideoPresentation />
      <ShortsGallery />

      {/* Blog */}
      {recentPosts.length ? (
        <section className="space-y-6">
          <SectionTitle
            eyebrow="Blog"
            title="Nos derniers articles"
            action={
              <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Tous les articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-primary">Lire l&apos;article →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AppCTA
        title="Prêt à commander ?"
        subtitle="Rejoignez les clients qui font leurs achats sur Monmarché et se font livrer partout à Conakry."
        images={featured.slice(8, 12).map((product) => product.image)}
      />
    </div>
  );
}

function getRecentPosts(limit = 3) {
  const dir = path.join(process.cwd(), "content", "blog");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((filename) => filename.endsWith(".mdx"));
  const posts = files
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const meta = extractMetadata(fileContent);
      const firstHeading = extractFirstHeading(fileContent);
      const firstParagraph = extractFirstParagraph(fileContent);
      return {
        slug: meta.slug || filename.replace(/\.mdx?$/, ""),
        title: meta.title || firstHeading || "Article",
        excerpt: meta.excerpt || firstParagraph || "",
        date: meta.date ? new Date(meta.date) : new Date(0),
      };
    })
    .sort((a, b) => b.date - a.date);

  return posts.slice(0, limit);
}

function extractMetadata(content) {
  const match = content.match(/export const metadata\s*=\s*({[\s\S]*?});/);
  if (!match) return {};
  try {
    // Unsafe eval avoided by using Function on local files only
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${match[1]});`)();
  } catch (e) {
    return {};
  }
}

function extractFirstHeading(content) {
  const lines = content.split("\n");
  const headingLine = lines.find((line) => line.trim().startsWith("# "));
  return headingLine ? headingLine.replace(/^#\s+/, "").trim() : "";
}

function extractFirstParagraph(content) {
  const lines = content.split("\n");
  let inBody = false;
  for (const line of lines) {
    if (line.trim().startsWith("#")) {
      inBody = true;
      continue;
    }
    if (inBody && line.trim()) {
      return line.trim();
    }
  }
  return "";
}
