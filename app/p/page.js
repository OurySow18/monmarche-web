import DeepLinkFallback, { buildMetadata } from "./fallback-content";

export const metadata = buildMetadata();

export default function DeepLinkHomePage() {
  return <DeepLinkFallback />;
}
