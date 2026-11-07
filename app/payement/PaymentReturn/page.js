import OrangeMoneyReturnContent from "./payment-return-content";
import {
  buildOrangeMoneyReturnMetadata,
  normalizeOrangeMoneyStatus,
} from "./payment-return-status";

export function generateMetadata({ searchParams }) {
  const status = normalizeOrangeMoneyStatus(searchParams?.status || "return");
  return buildOrangeMoneyReturnMetadata(status);
}

export default function OrangeMoneyPaymentReturnPage({ searchParams }) {
  const status = normalizeOrangeMoneyStatus(searchParams?.status || "return");

  return <OrangeMoneyReturnContent status={status} />;
}
