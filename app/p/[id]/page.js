import { notFound } from "next/navigation";
import DeepLinkFallback from "../fallback-content";
import { getProduct, buildProductMetadata } from "../product-service";

export async function generateMetadata({ params }) {
  const { id } = params || {};
  const product = await getProduct(id);
  if (!product) {
    return buildProductMetadata(null, id, { notFound: true });
  }
  return buildProductMetadata(product, id);
}

export default async function ProductDeepLinkPage({ params }) {
  const { id } = params || {};
  const product = await getProduct(id);
  if (!product) {
    notFound();
  }
  return <DeepLinkFallback id={id} product={product} />;
}
