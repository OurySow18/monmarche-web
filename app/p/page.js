import DeepLinkFallback from "./fallback-content";
import { buildProductMetadata } from "./product-service";

export const metadata = buildProductMetadata(null, "");

export default function DeepLinkHomePage() {
  return <DeepLinkFallback />;
}
