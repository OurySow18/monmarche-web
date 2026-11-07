import OrangeMoneyReturnContent from "../payement/PaymentReturn/payment-return-content";
import { normalizeOrangeMoneyStatus } from "../payement/PaymentReturn/payment-return-status";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function OrangeReturnPage({ searchParams }) {
  const status = normalizeOrangeMoneyStatus(searchParams?.status || "return");

  return <OrangeMoneyReturnContent status={status} />;
}
