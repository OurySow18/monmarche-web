"use client";

import { useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";

type StarRatingProps = {
  value: number;
  onChange: (nextValue: number) => void;
  disabled?: boolean;
  max?: number;
  id?: string;
  label?: string;
};

export default function StarRating({
  value,
  onChange,
  disabled = false,
  max = 5,
  id = "review-rating",
  label = "Note",
}: StarRatingProps) {
  const stars = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);

  // refs pour focus management
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // quand value change (clavier ou click), on focus l'étoile sélectionnée (si pas disabled)
  useEffect(() => {
    if (disabled) return;
    if (value < 1) return;
    const el = btnRefs.current[value - 1];
    el?.focus();
  }, [value, disabled]);

  function clamp(next: number) {
    return Math.min(max, Math.max(1, next));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;

    const current = value >= 1 ? value : 1;

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(clamp(current + 1));
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(clamp(current - 1));
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      onChange(1);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      onChange(max);
      return;
    }
    // Espace/Entrée : valide la sélection courante (déjà le cas)
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange(current);
    }
  }

  // roving tabindex: un seul "radio" tabbable
  const tabbable = value >= 1 ? value : 1;

  return (
    <div className="space-y-2">
      <p id={`${id}-label`} className="text-sm font-medium text-gray-700">
        {label}
      </p>

      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="flex items-center gap-2"
        onKeyDown={onKeyDown}
      >
        {stars.map((star, idx) => {
          const active = star <= value;

          return (
            <button
              key={star}
              ref={(el) => {
                btnRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
              disabled={disabled}
              tabIndex={disabled ? -1 : star === tabbable ? 0 : -1}
              onClick={() => onChange(star)}
              className={`h-11 w-11 rounded-full border text-xl transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                active
                  ? "border-amber-400 bg-amber-100 text-amber-500"
                  : "border-gray-300 bg-white text-gray-300"
              } ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-amber-300"}`}
            >
              ★
            </button>
          );
        })}
      </div>
    </div>
  );
}
