"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const APP_STORE_URL = "https://apps.apple.com/de/app/monmarche/id6479302215";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share";
const SITE_URL = "https://monmarchegn.com";

export function normalizeOrangeMoneyStatus(status) {
  return status === "cancel" ? "cancel" : "return";
}

export function buildOrangeMoneyReturnMetadata(status) {
  const isCancel = status === "cancel";
  const title = isCancel
    ? "Paiement annulé — Monmarché"
    : "Retour au marchand — Monmarché";
  const description = isCancel
    ? "Le paiement Orange Money n'a pas été finalisé. Revenez dans l'application Monmarche pour réessayer."
    : "La vérification du paiement est en cours. Revenez dans l'application Monmarche pour suivre la confirmation de votre commande.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/payement/PaymentReturn?status=${status}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/payement/PaymentReturn?status=${status}`,
      images: [
        {
          url: `${SITE_URL}/images/og-monmarche.png`,
          width: 1200,
          height: 630,
          alt: "Monmarché",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/og-monmarche.png`],
    },
  };
}

export default function OrangeMoneyReturnContent({ status = "return" }) {
  const normalizedStatus = normalizeOrangeMoneyStatus(status);
  const isCancel = normalizedStatus === "cancel";
  const [isOpening, setIsOpening] = useState(true);
  const [autoOpenAttempted, setAutoOpenAttempted] = useState(false);
  const timeoutRef = useRef(null);
  const cancelledRef = useRef(false);

  const deepLink = useMemo(
    () =>
      `monmarche://payement/PaymentReturn?status=${normalizedStatus}`,
    [normalizedStatus]
  );

  useEffect(() => {
    cancelledRef.current = false;

    function clearPendingTimer() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function markAppOpened() {
      cancelledRef.current = true;
      clearPendingTimer();
    }

    function attemptOpen() {
      setIsOpening(true);
      setAutoOpenAttempted(true);
      clearPendingTimer();

      timeoutRef.current = window.setTimeout(() => {
        if (!cancelledRef.current && document.visibilityState === "visible") {
          setIsOpening(false);
        }
      }, 1600);

      window.location.href = deepLink;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        markAppOpened();
      }
    }

    window.addEventListener("pagehide", markAppOpened);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    attemptOpen();

    return () => {
      cancelledRef.current = true;
      clearPendingTimer();
      window.removeEventListener("pagehide", markAppOpened);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [deepLink]);

  const title = isCancel ? "Paiement annulé" : "Retour au marchand";
  const description = isCancel
    ? "Le paiement n'a pas été finalisé."
    : "La vérification du paiement est en cours.";
  const subMessage = isCancel
    ? "Vous pouvez revenir dans l'application Monmarche pour réessayer."
    : "Vous pouvez revenir dans l'application Monmarche pour suivre la confirmation de votre commande.";

  return (
    <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl items-center px-4 py-12 sm:py-16">
      <div className="w-full overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-orange-100 shadow-xl">
        <div className="flex flex-col gap-8 p-8 sm:p-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-3 text-xl font-semibold text-[#ff6f00]">
              <Image
                src="/logo.png"
                alt="Monmarché"
                width={56}
                height={56}
                className="rounded-xl shadow"
              />
              <span>Monmarché</span>
            </div>
            <div
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                isCancel
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {isCancel ? "Annulation" : "Retour"}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-gray-700">{description}</p>
            <p className="max-w-2xl text-sm text-gray-600">{subMessage}</p>
          </div>

          <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                  Retour Orange Money
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {isOpening
                    ? "Ouverture de l&apos;application Monmarche..."
                    : "Si l&apos;application ne s&apos;ouvre pas, utilisez le bouton ci-contre."}
                </p>
                <p className="text-sm text-gray-600">
                  {isCancel
                    ? "Le retour web ne confirme pas le paiement. Revenez dans l'application pour relancer ou reprendre le parcours."
                    : "Le retour web ne confirme pas le paiement. Revenez dans l'application pour suivre la vérification côté commande."}
                </p>
                {autoOpenAttempted && !isOpening && (
                  <p className="text-sm text-gray-500">
                    Si rien ne se passe, l&apos;application n&apos;est peut-être pas
                    installée ou le navigateur bloque l&apos;ouverture automatique.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-md">
              <a href={deepLink}>
                <Button className="w-full bg-[#ff6f00] py-3 text-base text-white hover:bg-orange-600">
                  Ouvrir l&apos;application
                </Button>
              </a>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full border-[#ff6f00] text-[#ff6f00] hover:bg-orange-50"
                  >
                    App Store
                  </Button>
                </Link>
                <Link
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full border-[#ff6f00] text-[#ff6f00] hover:bg-orange-50"
                  >
                    Play Store
                  </Button>
                </Link>
              </div>
              <Link
                href="/"
                className="text-center text-sm font-medium text-gray-500 underline-offset-4 hover:text-gray-700 hover:underline"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
