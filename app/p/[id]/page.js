import { notFound } from "next/navigation";
import ProductView from "../product-view";
import { getProduct, buildProductMetadata } from "../product-service";
import { formatPrice, getCategory, listPublicProducts } from "@/lib/catalog";

// Retrouve le produit dans le catalogue publié : donne sa catégorie, son
// vendeur et des produits similaires. Absent = brouillon ou masqué.
async function getCatalogContext(product) {
  const products = await listPublicProducts();
  const listed = products.find(
    (item) => item.id === product.id || item.url === product.url
  );
  if (!listed) return { listed: null, category: null, related: [] };

  const related = products
    .filter((item) => item.categorySlug === listed.categorySlug && item.url !== listed.url)
    .slice(0, 8);
  return { listed, category: getCategory(listed.categorySlug), related };
}

export async function generateMetadata({ params }) {
  const { id } = params || {};
  const product = await getProduct(id);
  if (!product) {
    return buildProductMetadata(null, id, { notFound: true });
  }
  const { listed } = await getCatalogContext(product);
  const metadata = buildProductMetadata(product, id);
  const price = formatPrice(product.price, product.currency);
  metadata.title = `${product.title}${price ? ` – ${price}` : ""} | Acheter à Conakry`;
  if (!product.description) {
    metadata.description = `Achetez ${product.title}${price ? ` à ${price}` : ""} sur Monmarché${
      listed?.vendorName ? ` chez ${listed.vendorName}` : ""
    }. Livraison à domicile partout à Conakry.`;
  }
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
  const { listed, category, related } = await getCatalogContext(product);
  return (
    <ProductView
      product={{ ...listed, ...product, vendorName: listed?.vendorName, vendorId: listed?.vendorId, brand: listed?.brand }}
      category={category}
      related={related}
    />
  );
}
