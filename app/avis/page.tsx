import { Suspense } from "react";
import AvisPageClient from "./page-client";

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
