import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FALLBACK_IMAGE } from "../p/product-service";

const APP_STORE_URL = "https://apps.apple.com/de/app/monmarche/id6479302215";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share";

export default function VendorDeepLinkFallback({
  id,
  vendor,
  errorCode,
  errorMessage,
}) {
  const deepLinkTarget = vendor?.id || "";
  const deepLink = deepLinkTarget
    ? `monmarche://vendor/${deepLinkTarget}`
    : "monmarche://";
  const hasVendor = Boolean(vendor);

  const vendorTitle =
    vendor?.title || (id ? `Boutique ${id}` : "Boutique Monmarché");
  const vendorImage = vendor?.logo || vendor?.cover || vendor?.image || FALLBACK_IMAGE;

  const title = hasVendor ? "Ouvrir la boutique" : "Lien de boutique indisponible";
  const subtitle = hasVendor
    ? "Appuyez sur le bouton ci-dessous pour ouvrir cette boutique dans l’application Monmarché."
    : errorMessage ||
      "Cette boutique est introuvable ou indisponible. Vous pouvez ouvrir l’application Monmarché pour continuer.";

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="overflow-hidden rounded-3xl border border-orange-100 shadow-xl bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="flex flex-col gap-10 p-8 sm:p-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-3 text-[#ff6f00] font-semibold text-xl">
              <Image
                src="/logo.png"
                alt="Monmarché"
                width={56}
                height={56}
                className="rounded-xl shadow"
              />
              <span>Monmarché</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-gray-700 max-w-2xl">{subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="bg-white/70 border border-orange-100 rounded-2xl p-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-orange-100 bg-white">
                    <Image
                      src={vendorImage}
                      alt={vendorTitle}
                      fill
                      sizes="80px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold">
                      Boutique — {vendorTitle}
                    </p>
                    <p className="text-gray-800 font-semibold">{vendorTitle}</p>
                  </div>
                </div>

                {hasVendor ? (
                  <>
                    <p className="text-gray-800 font-semibold text-lg">
                      Ouvrez cette boutique dans Monmarché pour voir ses produits et disponibilités.
                    </p>
                    <p className="text-gray-600 text-sm">
                      Si l&apos;application ne s&apos;ouvre pas, utilisez les
                      liens ci-dessous pour installer ou mettre à jour.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 font-semibold text-lg">
                      Ouvrez l&apos;application Monmarché pour retrouver
                      d&apos;autres boutiques et produits.
                    </p>
                    <p className="text-gray-600 text-sm">
                      {errorCode === "vendor_inactive"
                        ? "Cette boutique est actuellement inactive."
                        : "Le lien demandé n’est pas disponible pour le moment."}
                    </p>
                  </>
                )}
              </div>
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
                  <Button
                    variant="outline"
                    className="w-full border-[#ff6f00] text-[#ff6f00] hover:bg-orange-50"
                  >
                    App Store
                  </Button>
                </Link>
                <Link
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full border-[#ff6f00] text-[#ff6f00] hover:bg-orange-50"
                  >
                    Play Store
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Conseil : si rien ne se passe, vérifiez que l&apos;app est
                installée puis réessayez.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
