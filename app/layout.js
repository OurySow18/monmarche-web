import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Monmarché – Vos courses livrées à domicile",
  description: "Application de vente et livraison de produits alimentaires frais en Guinée.",
  keywords: [
    "livraison Conakry",
    "Monmarché",
    "courses en ligne Guinée",
    "produits frais",
    "Orange Money"
  ],
  authors: [{ name: "Monmarché", url: "https://monmarchegn.com" }],
  creator: "Monmarché",
  openGraph: {
    title: "Monmarché – Vos courses livrées à domicile",
    description: "Commandez en ligne et recevez vos produits frais rapidement en Guinée.",
    url: "https://monmarchegn.com",
    siteName: "Monmarché",
    locale: "fr_FR",
    type: "website",
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
    description: "Courses livrées rapidement à Conakry et bientôt dans toute la Guinée.",
    creator: "@monmarchegn",
    images: ["/images/og-monmarche.png"]
  },
  metadataBase: new URL("https://monmarchegn.com")
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-white text-gray-800`}>
        <Header />
        <main className="px-4 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
