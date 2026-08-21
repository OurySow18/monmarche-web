"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from '../../public/logo.png'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Logo Monmarché" width={36} height={36} />
          <span className="text-primary font-bold text-lg">Monmarché</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/a-propos" className="hover:text-primary">À propos</Link>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <Link href="/conditions" className="hover:text-primary">Conditions</Link>
          <Link href="/confidentialite" className="hover:text-primary">Confidentialité</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Panel */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-4 space-y-3 text-sm">
          <Link href="/a-propos" onClick={handleLinkClick} className="block hover:text-primary">À propos</Link>
          <Link href="/blog" onClick={handleLinkClick} className="block hover:text-primary">Blog</Link>
          <Link href="/conditions" onClick={handleLinkClick} className="block hover:text-primary">Conditions</Link>
          <Link href="/confidentialite" onClick={handleLinkClick} className="block hover:text-primary">Confidentialité</Link>
        </nav>
      )}
    </header>
  );
}
