import Image from "next/image";
import {
  buildVendorMetadata,
  getVendorResult,
} from "../vendor-service";

export async function generateMetadata({ params }) {
  const { vendorId } = params || {};
  const result = await getVendorResult(vendorId);
  const vendor = result.vendor;

  if (!vendor) {
    return buildVendorMetadata(null, vendorId, {
      notFound: result.errorCode === "vendor_not_found",
      errorCode: result.errorCode,
    });
  }

  return buildVendorMetadata(vendor, vendorId);
}

export default async function VendorPage({ params }) {
  const { vendorId } = params || {};
  const result = await getVendorResult(vendorId);
  const vendor = result.vendor;

  if (!vendor) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-sm text-center">
          <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold">
            Boutique Monmarché
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
            {result.errorCode === "vendor_inactive"
              ? "Boutique indisponible"
              : "Impossible d'afficher cette boutique"}
          </h1>
          <p className="mt-4 text-gray-600">
            {result.userMessage ||
              "Cette boutique est introuvable ou indisponible pour le moment."}
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-full bg-[#ff6f00] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Retour à l'accueil
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
        <div className="h-36 w-full bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100" />
        <div className="px-6 pb-8">
          <div className="-mt-14 flex items-end gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow">
              <Image
                src={vendor.logo || vendor.cover || vendor.image}
                alt={vendor.title}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="pb-2">
              <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold">
                Boutique Monmarché
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {vendor.title}
              </h1>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/60 p-5">
            <p className="text-gray-700">
              {vendor.description?.trim() ||
                "Découvrez cette boutique sur Monmarché et parcourez ses produits disponibles."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
