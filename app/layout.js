import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import MobileAppBar from "@/app/_components/MobileAppBar";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://monmarchegn.com";
const DEFAULT_TITLE =
  "Monmarché – Achat et vente en ligne en Guinée, livraison à Conakry";
const DEFAULT_DESCRIPTION =
  "Marketplace guinéenne : achetez en ligne épicerie, mode, beauté, maison, bébé et électronique auprès de vendeurs guinéens, livrés à domicile partout à Conakry.";

export const metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Monmarché",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Monmarché",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "Monmarché",
    locale: "fr_GN",
    images: [
      {
        url: "/images/og-monmarche.png",
        width: 800,
        height: 600,
        alt: "Aperçu Monmarché",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Monmarché",
    description: "Achat et vente en ligne en Guinée, livraison à domicile partout à Conakry.",
    images: ["/images/og-monmarche.png"]
  },
  itunes: {
    appId: "6479302215",
  },
  metadataBase: new URL(SITE_URL)
};

// Identité de l'entreprise pour Google (panneau de connaissance) et les IA.
const organizationJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Monmarché",
    alternateName: ["Monmarche", "Monmarché Guinée", "monmarchegn"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: "infos@monmarchegn.com",
    description: DEFAULT_DESCRIPTION,
    areaServed: { "@type": "City", name: "Conakry" },
    sameAs: [
      "https://www.instagram.com/monmarchegn",
      "https://www.tiktok.com/@monmarchegn",
      "https://apps.apple.com/app/monmarche/id6479302215",
      "https://play.google.com/store/apps/details?id=com.amasow.Monmarche",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Monmarché",
    url: SITE_URL,
    inLanguage: "fr-GN",
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-white text-gray-800`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
        <MobileAppBar />
      </body>
    </html>
  );
}
