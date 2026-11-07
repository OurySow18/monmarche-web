"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from '../../public/logo.png'

const MOBILE_LINKS = [
  { href: "/categorie", label: "Catégories" },
  { href: "/livraison-conakry", label: "Livraison" },
  { href: "/a-propos", label: "À propos" },
  { href: "/vendre-en-ligne-guinee", label: "Vendre" },
  { href: "/blog", label: "Blog" },
  { href: "/conditions", label: "Conditions" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export default function Header() {
  // Menu mobile en <details> : il s'ouvre et se ferme sans JavaScript (utile sur
  // une connexion instable). Le JavaScript ne fait que le refermer après un clic
  // ou avec Échap, car l'en-tête reste affiché d'une page à l'autre.
  const menuRef = useRef(null);
  const closeMenu = () => {
    if (menuRef.current) menuRef.current.open = false;
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Logo Monmarché" width={36} height={36} />
          <span className="text-primary font-bold text-lg">Monmarché</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/categorie" className="hover:text-primary">Catégories</Link>
          <Link href="/livraison-conakry" className="hover:text-primary">Livraison</Link>
          <Link href="/a-propos" className="hover:text-primary">À propos</Link>
          <Link href="/vendre-en-ligne-guinee" className="hover:text-primary">Vendre</Link>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
        </nav>

        <Link
          href="/application-mobile-guinee"
          className="hidden md:inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
        >
          Télécharger l&apos;app
        </Link>

        {/* Mobile Nav */}
        <details ref={menuRef} className="group md:hidden">
          <summary
            className="list-none cursor-pointer text-primary [&::-webkit-details-marker]:hidden"
            aria-label="Menu"
          >
            <Menu size={28} className="group-open:hidden" aria-hidden="true" />
            <X size={28} className="hidden group-open:block" aria-hidden="true" />
          </summary>
          <nav className="absolute inset-x-0 top-full bg-white border-t shadow-md px-4 py-4 space-y-3 text-sm">
            {MOBILE_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={closeMenu} className="block hover:text-primary">
                {label}
              </Link>
            ))}
            <Link
              href="/application-mobile-guinee"
              onClick={closeMenu}
              className="block rounded-full bg-primary px-4 py-2 text-center font-semibold text-white"
            >
              Télécharger l&apos;app
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
