import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Monmarché – Vos courses livrées à domicile",
  description: "Application de vente et livraison de produits alimentaires frais en Guinée.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Monmarché – Vos courses livrées à domicile",
    description: "Commandez en ligne et recevez vos produits frais rapidement en Guinée.",
    url: "https://monmarchegn.com",
    siteName: "Monmarché",
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
    images: ["/images/og-monmarche.png"]
  },
  metadataBase: new URL("https://monmarchegn.com")
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-white text-gray-800`}>
        <Header />
        <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
