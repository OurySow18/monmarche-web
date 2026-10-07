import { notFound } from "next/navigation";
import ProductView from "../product-view";
import { getProduct, buildProductMetadata } from "../product-service";
import { formatPrice, getProductContext } from "@/lib/catalog";

// Page générée à la première visite puis gardée en cache une heure (serveur et
// CDN Firebase) : un robot qui parcourt les fiches ne relit plus Firestore à
// chaque passage. La valeur doit être littérale pour Next.js (= CACHE_SECONDS
// dans product-service.js).
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { id } = params || {};
  const product = await getProduct(id);
  if (!product) {
    return buildProductMetadata(null, id, { notFound: true });
  }
  const { listed } = await getProductContext(product);
  const metadata = buildProductMetadata(product, id);
  const price = formatPrice(product.price, product.currency);
  const vendorName = product.listing?.vendorName;
  metadata.title = `${product.title}${price ? ` – ${price}` : ""} | Acheter à Conakry`;
  if (!product.description) {
    metadata.description = `Achetez ${product.title}${price ? ` à ${price}` : ""} sur Monmarché${
      vendorName ? ` chez ${vendorName}` : ""
    }. Livraison à domicile partout à Conakry.`;
  }
  // Brouillon ou produit masqué : accessible par lien, mais pas indexé.
  if (!listed) {
    metadata.robots = { index: false, follow: true };
  }
  return metadata;
}

export default async function ProductPage({ params }) {
  const { id } = params || {};
  const product = await getProduct(id);
  if (!product) {
    notFound();
  }
  const { listed, category, related } = await getProductContext(product);
  const { vendorName, vendorId, brand } = product.listing || {};
  return (
    <ProductView
      product={{ ...product, vendorName, vendorId, brand }}
      category={listed ? category : null}
      related={related}
    />
  );
}
