export const FUNCTION_BASE_URL = (
  process.env.NEXT_PUBLIC_FUNCTION_BASE_URL || ""
).replace(/\/+$/, "");

export function hasReviewApiBaseUrl() {
  return Boolean(FUNCTION_BASE_URL);
}

export type ReviewItem = {
  title: string;
  qty: number;
  price: number;
  vendorName?: string;
};

export type ValidateReviewLinkResponse = {
  ok: boolean;
  orderId?: string;
  deliveredAt?: string;
  items?: ReviewItem[];
  total?: number;
  currency?: string;
  error?: string;
};

export type ValidReviewData = {
  orderId: string;
  deliveredAt: string;
  items: ReviewItem[];
  total: number;
  currency: string;
};

export type SubmitReviewResponse = {
  ok: boolean;
  error?: string;
};

export class ReviewApiError extends Error {
  code: string;

  constructor(message: string, code = "unknown_error") {
    super(message);
    this.code = code;
  }
}

function assertBaseUrl() {
  if (!FUNCTION_BASE_URL) {
    throw new ReviewApiError(
      "Configuration manquante: NEXT_PUBLIC_FUNCTION_BASE_URL.",
      "missing_config"
    );
  }
}

function buildUrl(path: string) {
  assertBaseUrl();
  return `${FUNCTION_BASE_URL}${path}`;
}

function formatApiError(error?: string) {
  const raw = (error || "").toLowerCase();
  if (raw.includes("expired")) return "Ce lien a expiré.";
  if (raw.includes("already")) return "Ce lien a déjà été utilisé.";
  if (raw.includes("invalid")) return "Ce lien est invalide.";
  return "Le lien d'avis est invalide ou indisponible.";
}

export async function validateReviewLink(
  token: string,
  sig: string
): Promise<ValidReviewData> {
  const url = new URL(buildUrl("/validateReviewLink"));
  url.searchParams.set("token", token);
  url.searchParams.set("sig", sig);

  let data: ValidateReviewLinkResponse;
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    data = (await response.json()) as ValidateReviewLinkResponse;
  } catch (error) {
    throw new ReviewApiError(
      "Impossible de valider le lien pour le moment.",
      "network_error"
    );
  }

  if (!data.ok) {
    throw new ReviewApiError(
      formatApiError(data.error),
      data.error || "invalid_link"
    );
  }

  if (
    !data.orderId ||
    !data.deliveredAt ||
    !Array.isArray(data.items) ||
    typeof data.total !== "number" ||
    !data.currency
  ) {
    throw new ReviewApiError(
      "Réponse incomplète du service de validation.",
      "invalid_response"
    );
  }

  return {
    orderId: data.orderId,
    deliveredAt: data.deliveredAt,
    items: data.items,
    total: data.total,
    currency: data.currency,
  };
}

export async function submitReview(params: {
  token: string;
  sig: string;
  rating: number;
  comment?: string;
}): Promise<void> {
  const url = buildUrl("/submitReview");
  const payload: {
    token: string;
    sig: string;
    rating: number;
    comment?: string;
  } = {
    token: params.token,
    sig: params.sig,
    rating: params.rating,
  };

  if (params.comment && params.comment.trim().length > 0) {
    payload.comment = params.comment.trim();
  }

  let data: SubmitReviewResponse;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    data = (await response.json()) as SubmitReviewResponse;
  } catch (error) {
    throw new ReviewApiError(
      "Impossible d'envoyer votre avis pour le moment.",
      "network_error"
    );
  }

  if (!data.ok) {
    throw new ReviewApiError(
      "Envoi impossible. Veuillez réessayer.",
      data.error || "submit_failed"
    );
  }
}
