import OrangeMoneyReturnContent from "../payement/PaymentReturn/payment-return-content";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function OrangeCancelPage() {
  return <OrangeMoneyReturnContent status="cancel" />;
}
