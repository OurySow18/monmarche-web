import OrangeMoneyReturnContent, {
  normalizeOrangeMoneyStatus,
} from "../payement/PaymentReturn/payment-return-content";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function OrangeReturnPage({ searchParams }) {
  const status = normalizeOrangeMoneyStatus(searchParams?.status || "return");

  return <OrangeMoneyReturnContent status={status} />;
}
