import dynamic from "next/dynamic";
import fs from "fs";
import path from "path";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import ShortsGallery from "../components/ui/ShortsGallery";
import VideoPresentation from "@/components/ui/VideoPresentation";

const HeroSection = dynamic(() => import("./_components/Hero"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export default function HomePage() {
  const recentPosts = getRecentPosts(3);

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-12">
          Pourquoi choisir Monmarché ?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Feature
            icon={<ShoppingCart />}
            title="Large sélection de produits"
            description="Riz, jus, produits laitiers, pour enfants et plus encore."
            slug="large-selection-produits"
          />
          <Feature
            icon={<Truck />}
            title="Livraison rapide"
            description="Service fiable à Conakry, bientôt dans toute la Guinée."
            slug="livraison-rapide"
          />
          <Feature
            icon={<ShieldCheck />}
            title="Paiement sécurisé"
            description="Commandez et payez en toute sécurité en ligne ou à la livraison."
            slug="paiement-securise"
          />
          <Feature
            icon={<ShoppingCart />}
            title="Commandes personnalisées"
            description="Créez vos paniers selon vos préférences alimentaires."
            slug="commandes-personnalisees"
          />
          <Feature
            icon={<ShieldCheck />}
            title="Sécurité alimentaire"
            description="Produits frais et respect des normes d'hygiène."
            slug="securite-alimentaire"
          />
          <Feature
            icon={<PhoneCall />}
            title="Support dédié"
            description="Notre équipe répond à vos questions à tout moment."
            slug="support-dedie"
          />
        </div>
      </section>

      {/* Vidéo Section */}
      <VideoPresentation />
      <ShortsGallery />
      {/* Blog Teaser Section */}
      <section className="py-16 px-4 md:px-6 bg-orange-50 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#ff6f00] mb-8">
          Nos derniers articles
        </h2>
        <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {recentPosts.length === 0 && (
            <p className="text-gray-700 col-span-full">
              Aucun article disponible pour le moment. Revenez bientôt !
            </p>
          )}
          {recentPosts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              slug={post.slug}
            />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/blog">
            <Button className="bg-[#ff6f00] text-white px-6 py-3 hover:bg-orange-600">
              Voir tous les articles
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#ff6f00] text-white text-center px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Simplifiez vos courses dès aujourd&apos;hui !
        </h2>
        <p className="mt-4 text-base sm:text-lg">
          Téléchargez Monmarché et profitez d&apos;une nouvelle façon de faire
          vos courses.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="text-lg px-6 py-3 bg-white text-[#ff6f00] w-full sm:w-auto">
              Télécharger sur Android
            </Button>
          </a>
          <a
            href="https://apps.apple.com/de/app/monmarche/id6479302215"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="text-lg px-6 py-3 border-white text-[#ff6f00] w-full sm:w-auto"
            >
              Télécharger sur iPhone
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, description, slug }) {
  const content = (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all h-full">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <div className="text-[#ff6f00] mb-4">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      </CardContent>
    </Card>
  );

  return slug ? (
    <Link href={`/blog/${slug}`} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

function BlogCard({ title, excerpt, slug }) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all h-full">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <h3 className="text-xl font-semibold text-[#ff6f00] mb-2">{title}</h3>
        <p className="text-gray-600 flex-1">{excerpt}</p>
        <Link
          href={`/blog/${slug}`}
          className="mt-4 text-[#ff6f00] font-medium hover:underline"
        >
          Lire l&apos;article →
        </Link>
      </CardContent>
    </Card>
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

function HeroFallback() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col items-center justify-center text-center px-4 md:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#ff6f00]">
        Vos courses livrées à domicile
      </h1>
      <p className="mt-4 text-base sm:text-lg md:text-xl max-w-xl">
        Produits de qualité, livraison rapide et paiement sécurisé. Partout à
        Conakry et bientôt dans toute la Guinée. Monmarche vous propose un service clientèle professionnel.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <a
          href="https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="text-lg px-6 py-3 w-full sm:w-auto">
            Télécharger sur Android
          </Button>
        </a>
        <a
          href="https://apps.apple.com/de/app/monmarche/id6479302215"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            className="text-lg px-6 py-3 w-full sm:w-auto"
          >
            Télécharger sur iPhone
          </Button>
        </a>
      </div>
    </section>
  );
}
