import Image from "next/image";
import {
  Baby,
  BadgeCheck,
  Briefcase,
  Car,
  Gamepad2,
  Hammer,
  Headphones,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react";
import logo from "@/public/logo.png";
import StoreButtons from "./StoreButtons";

const CATEGORY_ICONS = {
  epicerie: ShoppingBasket,
  mode: Shirt,
  beaute: Sparkles,
  maison: Sofa,
  bebe: Baby,
  electronique: Smartphone,
  "jeux-jouets": Gamepad2,
  services: Briefcase,
  "auto-moto": Car,
  bricolage: Hammer,
};

export function CategoryIcon({ slug, className = "h-6 w-6" }) {
  const Icon = CATEGORY_ICONS[slug] || ShoppingBasket;
  return <Icon className={className} aria-hidden="true" />;
}

const TRUST_ITEMS = [
  { icon: Truck, title: "Livraison à domicile", text: "Partout à Conakry" },
  { icon: Wallet, title: "Paiement flexible", text: "Orange Money ou à la livraison" },
  { icon: BadgeCheck, title: "Vendeurs vérifiés", text: "Contrôlés par Monmarché" },
  { icon: Headphones, title: "Service client", text: "Par e-mail et WhatsApp" },
];

// Les 4 arguments qui lèvent les freins à l'achat en ligne en Guinée.
export function TrustBar({ className = "" }) {
  return (
    <ul className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
      {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-3 sm:p-4 shadow-sm"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-gray-900">{title}</span>
            <span className="block text-xs text-gray-600">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// FAQ en accordéon ; le texte reste dans le HTML pour Google.
export function FaqList({ faq, title = "Questions fréquentes" }) {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h2>
      <div className="divide-y divide-gray-100 rounded-3xl border border-gray-100 bg-white shadow-sm">
        {faq.map((item, index) => (
          <details key={item.q} className="group p-5 sm:px-6" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-gray-700">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// En-tête coloré commun aux pages catégories, livraison et guides.
export function PageHero({ eyebrow, title, subtitle, icon, children }) {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 px-6 py-10 sm:px-10 sm:py-14 text-white shadow-lg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/10"
      />
      <div className="relative max-w-3xl space-y-4">
        {eyebrow ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {icon}
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">{title}</h1>
        {subtitle ? <p className="text-base sm:text-lg text-white/90">{subtitle}</p> : null}
        {children}
      </div>
    </header>
  );
}

// Grand bloc « Téléchargez l'application » placé en fin de page.
export function AppCTA({
  title = "Téléchargez Monmarché et commandez en 2 minutes",
  subtitle = "Des centaines de produits de vendeurs guinéens, livrés chez vous à Conakry. Gratuit sur Android et iPhone.",
  images = [],
}) {
  const tiles = images.filter(Boolean).slice(0, 4);
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
      />
      <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Gratuit · Android et iPhone
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">{title}</h2>
          <p className="text-white/80">{subtitle}</p>
          <StoreButtons variant="light" />
          <p className="text-xs text-white/60">
            Paiement Orange Money, virement ou à la livraison · Service client réactif
          </p>
        </div>

        {/* Téléphone stylisé : rend l'application tangible sans capture d'écran. */}
        <div className="mx-auto w-52 sm:w-60" aria-hidden="true">
          <div className="rounded-[2.2rem] border-[6px] border-gray-700 bg-white p-3 shadow-2xl rotate-3">
            <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-gray-200" />
            <div className="flex items-center gap-2 px-1">
              <Image src={logo} alt="" width={28} height={28} className="rounded-lg" />
              <span className="text-sm font-bold text-primary">Monmarché</span>
            </div>
            <div className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-[10px] text-gray-500">
              Rechercher un produit…
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {tiles.length === 4
                ? tiles.map((src) => (
                    <div key={src} className="relative aspect-square overflow-hidden rounded-xl bg-orange-100">
                      <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                    </div>
                  ))
                : ["epicerie", "mode", "beaute", "electronique"].map((slug) => (
                    // Sans photos, des icônes de catégories plutôt que des cases vides.
                    <div
                      key={slug}
                      className="flex aspect-square items-center justify-center rounded-xl bg-orange-100 text-primary"
                    >
                      <CategoryIcon slug={slug} className="h-8 w-8" />
                    </div>
                  ))}
            </div>
            <div className="mt-3 rounded-xl bg-primary py-2 text-center text-xs font-semibold text-white">
              Commander
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
