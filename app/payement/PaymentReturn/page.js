import OrangeMoneyReturnContent, {
  buildOrangeMoneyReturnMetadata,
  normalizeOrangeMoneyStatus,
} from "./payment-return-content";

export function generateMetadata({ searchParams }) {
  const status = normalizeOrangeMoneyStatus(searchParams?.status || "return");
  return buildOrangeMoneyReturnMetadata(status);
}

export default function OrangeMoneyPaymentReturnPage({ searchParams }) {
  const status = normalizeOrangeMoneyStatus(searchParams?.status || "return");

  return <OrangeMoneyReturnContent status={status} />;
}
