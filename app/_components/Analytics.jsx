"use client";

import { useEffect } from "react";
import Script from "next/script";

// ID de mesure Google Analytics 4 (format G-XXXXXXXXXX). Vide = statistiques désactivées.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

function storeFromHref(href) {
  if (href.includes("play.google.com")) return "google_play";
  if (href.includes("apps.apple.com")) return "app_store";
  if (href.startsWith("monmarche://")) return "ouvrir_app";
  return null;
}

export default function Analytics() {
  // Un clic vers un store ou vers l'app est la conversion du site : on le remonte
  // comme événement pour savoir quelles pages font télécharger.
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const onClick = (event) => {
      const link = event.target.closest?.("a[href]");
      const store = link ? storeFromHref(link.getAttribute("href")) : null;
      if (store && typeof window.gtag === "function") {
        window.gtag("event", "clic_telechargement", {
          store,
          page_path: window.location.pathname,
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
