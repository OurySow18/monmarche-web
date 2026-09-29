import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/app-links";

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M3 20.5V3.5c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
    </svg>
  );
}

function StoreButton({ href, logo, small, big, variant }) {
  const styles =
    variant === "light"
      ? "bg-white text-gray-900 hover:bg-orange-50"
      : "bg-gray-900 text-white hover:bg-black";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-xl px-5 py-2.5 shadow-sm transition-transform hover:-translate-y-0.5 ${styles}`}
    >
      {logo}
      <span className="flex flex-col leading-tight text-left">
        <span className="text-[11px] opacity-80">{small}</span>
        <span className="text-base font-semibold">{big}</span>
      </span>
    </a>
  );
}

// Boutons « Disponible sur Google Play / App Store ».
export default function StoreButtons({ variant = "dark", className = "" }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <StoreButton
        href={PLAY_STORE_URL}
        logo={<PlayLogo />}
        small="Disponible sur"
        big="Google Play"
        variant={variant}
      />
      <StoreButton
        href={APP_STORE_URL}
        logo={<AppleLogo />}
        small="Télécharger dans"
        big="l'App Store"
        variant={variant}
      />
    </div>
  );
}
