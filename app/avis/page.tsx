import { Suspense } from "react";
import AvisPageClient from "./page-client";

export const metadata = {
  title: "Donnez votre avis — Monmarché",
  robots: { index: false, follow: false },
};

export default function AvisPage({ searchParams }) {
  const token =
    typeof searchParams?.token === "string" ? searchParams.token : "";
  const sig = typeof searchParams?.sig === "string" ? searchParams.sig : "";

  return (
    <Suspense fallback={null}>
      <AvisPageClient token={token} sig={sig} />
    </Suspense>
  );
}
