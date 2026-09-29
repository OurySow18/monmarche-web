"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import logo from "@/public/logo.png";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/app-links";

// Barre fixe en bas de l'écran sur mobile : le téléchargement reste à un pouce.
export default function MobileAppBar() {
  const [storeUrl, setStoreUrl] = useState(PLAY_STORE_URL);

  const pathname = usePathname();

  useEffect(() => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setStoreUrl(APP_STORE_URL);
    }
  }, []);

  // Les fiches produit ont leur propre barre « Commander ».
  if (pathname?.startsWith("/p/")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <Image src={logo} alt="" width={40} height={40} className="rounded-xl" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-sm font-bold text-gray-900">Monmarché</p>
          <p className="truncate text-xs text-gray-600">Livraison à domicile à Conakry</p>
        </div>
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow"
        >
          Télécharger
        </a>
      </div>
    </div>
  );
}
