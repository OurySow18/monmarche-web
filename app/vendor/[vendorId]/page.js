import VendorDeepLinkFallback from "../fallback-content";
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
      <VendorDeepLinkFallback
        id={vendorId}
        errorCode={result.errorCode}
        errorMessage={result.userMessage}
      />
    );
  }

  return <VendorDeepLinkFallback id={vendorId} vendor={vendor} />;
}
