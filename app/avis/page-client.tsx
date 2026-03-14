"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StarRating from "../../components/StarRating";
import {
  hasReviewApiBaseUrl,
  type ReviewItem,
  ReviewApiError,
  type ValidReviewData,
  submitReview,
  validateReviewLink,
} from "../../lib/reviewApi";

const COMMENT_MAX = 500;

type ViewState = "loading" | "invalid" | "ready" | "success";

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "GNF",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AvisPageClient({
  token,
  sig,
}: {
  token: string;
  sig: string;
}) {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [loadingMessage, setLoadingMessage] = useState("Validation du lien...");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState<ValidReviewData | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function runValidation() {
      if (!hasReviewApiBaseUrl()) {
        setErrorMessage("Ce lien n'est plus valide ou a expiré.");
        setViewState("invalid");
        return;
      }

      if (!token || !sig) {
        setErrorMessage("Lien incomplet. Vérifiez le message reçu.");
        setViewState("invalid");
        return;
      }

      setViewState("loading");
      setLoadingMessage("Validation du lien...");

      try {
        const response = await validateReviewLink(token, sig);
        if (cancelled) return;
        setData(response);
        setViewState("ready");
      } catch (error: unknown) {
        if (cancelled) return;
        const message =
          error instanceof ReviewApiError
            ? error.message
            : "Le lien d'avis est indisponible.";
        setErrorMessage(message);
        setViewState("invalid");
      }
    }

    runValidation();
    return () => {
      cancelled = true;
    };
  }, [token, sig]);

  const remainingChars = useMemo(() => COMMENT_MAX - comment.length, [comment]);

  async function handleSubmit() {
    if (rating < 1 || rating > 5) {
      setSubmitError("Veuillez sélectionner une note entre 1 et 5.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      await submitReview({
        token,
        sig,
        rating,
        comment: comment.trim(),
      });
      setViewState("success");
    } catch (error: unknown) {
      const message =
        error instanceof ReviewApiError
          ? error.message
          : "Erreur lors de l'envoi de votre avis.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff7ee] to-white px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {viewState === "loading" && (
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              Vérification en cours
            </h1>
            <p className="mt-3 text-gray-600">{loadingMessage}</p>
          </div>
        )}

        {viewState === "invalid" && (
          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              Lien non valide
            </h1>
            <p className="mt-3 text-gray-600">
              {errorMessage || "Ce lien est invalide, expiré ou déjà utilisé."}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[#ff6f00] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        )}

        {viewState === "ready" && data && (
          <div className="space-y-5">
            <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-semibold text-gray-900">
                Donnez votre avis sur votre commande
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Commande #{data.orderId} livrée le {formatDate(data.deliveredAt)}
              </p>
            </section>

            <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Résumé de la commande
              </h2>
              <ul className="mt-4 divide-y divide-orange-50">
                {data.items.map((item: ReviewItem, index: number) => (
                  <li
                    key={`${item.title}-${index}`}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">Qté : {item.qty}</p>
                      {item.vendorName && (
                        <p className="text-xs text-gray-400">
                          Vendeur : {item.vendorName}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatCurrency(item.price, data.currency)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-2xl bg-orange-50 p-4">
                <p className="text-sm text-orange-700">
                  Total :{" "}
                  <span className="font-semibold">
                    {formatCurrency(data.total, data.currency)}
                  </span>
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-5">
              <StarRating
                value={rating}
                onChange={setRating}
                disabled={submitting}
                label="Votre note"
              />

              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Commentaire (optionnel)
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value.slice(0, COMMENT_MAX))
                  }
                  maxLength={COMMENT_MAX}
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                  placeholder="Partagez votre expérience..."
                  disabled={submitting}
                />
                <p className="mt-2 text-right text-xs text-gray-500">
                  {remainingChars} caractères restants
                </p>
              </div>

              {submitError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-full bg-[#ff6f00] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Envoi en cours..." : "Envoyer mon avis"}
              </button>
            </section>
          </div>
        )}

        {viewState === "success" && (
          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              Merci, votre avis a été envoyé
            </h1>
            <p className="mt-3 text-gray-600">
              Votre retour nous aide à améliorer la qualité de service Monmarché.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[#ff6f00] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
