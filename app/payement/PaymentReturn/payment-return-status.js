// Fonctions partagées par les pages serveur (page.js, /return) et le composant
// navigateur. Elles ne doivent pas vivre dans le fichier "use client" : une page
// serveur ne peut pas appeler une fonction exportée par un composant navigateur
// (erreur 500 « n.tA is not a function »).
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
    // absolute : le titre contient déjà « Monmarché », pas de « | Monmarché » en plus.
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
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
