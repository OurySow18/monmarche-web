import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const APP_STORE_URL = "https://apps.apple.com/de/app/monmarche/id6479302215";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share";

export function buildMetadata(productId) {
  const hasProduct = Boolean(productId);
  const title = hasProduct
    ? `Ouvrir le produit ${productId} dans Monmarché`
    : "Ouvrir Monmarché";
  const description = hasProduct
    ? "Retrouvez ce produit directement dans l’application Monmarché."
    : "Ouvrez l’application Monmarché pour découvrir nos produits frais et livraisons rapides.";

  return {
    title,
    description,
    alternates: {
      canonical: hasProduct ? `/p/${productId}` : "/p",
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: hasProduct ? `/p/${productId}` : "/p",
      images: [
        {
          url: "/images/og-monmarche.png",
          width: 800,
          height: 600,
          alt: "Monmarché",
        },
      ],
    },
  };
}

export default function DeepLinkFallback({ id }) {
  const deepLink = id ? `monmarche://p/${id}` : "monmarche://";
  const hasProduct = Boolean(id);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="overflow-hidden rounded-3xl border border-orange-100 shadow-xl bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="flex flex-col gap-10 p-8 sm:p-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-3 text-[#ff6f00] font-semibold text-xl">
              <Image src="/logo.png" alt="Monmarché" width={56} height={56} className="rounded-xl shadow" />
              <span>Monmarché</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {hasProduct ? "Ouvrir le produit" : "Ouvrir l’application"}
            </h1>
            <p className="text-gray-700 max-w-2xl">
              {hasProduct
                ? "Appuyez sur le bouton ci-dessous pour ouvrir ce produit directement dans l’application Monmarché."
                : "Retrouvez tous nos produits frais et profitez d’une livraison rapide directement depuis l’application."}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="bg-white/70 border border-orange-100 rounded-2xl p-6 shadow-sm">
              {hasProduct ? (
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wide text-orange-600 font-semibold">
                    Produit #{id}
                  </p>
                  <p className="text-gray-800 font-semibold text-lg">
                    Ouvrez ce produit dans Monmarché pour voir les détails, la disponibilité et la livraison.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Si l’application ne s’ouvre pas, utilisez les liens ci-dessous pour installer ou mettre à jour.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wide text-orange-600 font-semibold">
                    Monmarché
                  </p>
                  <p className="text-gray-800 font-semibold text-lg">
                    Ouvrez l’application pour parcourir nos sélections et passer votre commande.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Compatible iOS et Android. Pas de redirection automatique : appuyez sur le bouton pour lancer l’app.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 flex flex-col gap-4">
              <a href={deepLink}>
                <Button className="w-full bg-[#ff6f00] text-white hover:bg-orange-600 text-base py-3">
                  Ouvrir dans l’app
                </Button>
              </a>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-[#ff6f00] text-[#ff6f00] hover:bg-orange-50">
                    App Store
                  </Button>
                </Link>
                <Link
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-[#ff6f00] text-[#ff6f00] hover:bg-orange-50">
                    Play Store
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Conseil : si rien ne se passe, vérifiez que l’app est installée puis réessayez.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
