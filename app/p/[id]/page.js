import DeepLinkFallback, { buildMetadata } from "../fallback-content";

export function generateMetadata({ params }) {
  const { id } = params || {};
  return buildMetadata(id);
}

export default function ProductDeepLinkPage({ params }) {
  const { id } = params || {};
  return <DeepLinkFallback id={id} />;
}
