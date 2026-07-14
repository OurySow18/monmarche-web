import OrangeMoneyReturnContent, {
  normalizeOrangeMoneyStatus,
} from "../payement/PaymentReturn/payment-return-content";

export default function OrangeReturnPage({ searchParams }) {
  const status = normalizeOrangeMoneyStatus(searchParams?.status || "return");

  return <OrangeMoneyReturnContent status={status} />;
}
