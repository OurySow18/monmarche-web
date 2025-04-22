"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from '../../public/logo.png'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Logo Monmarché" width={36} height={36} />
          <span className="text-[#ff6f00] font-bold text-lg">Monmarché</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/a-propos" className="hover:text-[#ff6f00]">À propos</Link>
          <Link href="/blog" className="hover:text-[#ff6f00]">Blog</Link>
          <Link href="/conditions" className="hover:text-[#ff6f00]">Conditions</Link>
          <Link href="/confidentialite" className="hover:text-[#ff6f00]">Confidentialité</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#ff6f00]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Panel */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-4 space-y-3 text-sm">
          <Link href="/a-propos" className="block hover:text-[#ff6f00]">À propos</Link>
          <Link href="/blog" className="block hover:text-[#ff6f00]">Blog</Link>
          <Link href="/conditions" className="block hover:text-[#ff6f00]">Conditions</Link>
          <Link href="/confidentialite" className="block hover:text-[#ff6f00]">Confidentialité</Link>
        </nav>
      )}
    </header>
  );
}
