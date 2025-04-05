"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 px-6 border-t mt-16">
      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-sm text-gray-700">
        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
          <p className="flex items-center gap-2"><Mail size={16} /> <a href="mailto:infos@monmarchegn.com" className="text-[#ff6f00]">infos@monmarchegn.com</a></p>
          <p className="flex items-center gap-2"><Phone size={16} /> +224 121229</p>
          <p className="flex items-center gap-2"><MapPin size={16} /> Cosa, Conakry</p>
          <p className="flex items-center gap-2"><Clock size={16} /> 09h - 17h</p>
        </div>

        {/* Réseaux */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Suivez-nous</h3>
          <p>Instagram : <span className="text-[#ff6f00]">@monmarchegn</span></p>
          <p>TikTok : <span className="text-[#ff6f00]">@monmarchegn</span></p>
          <p>Facebook : <span className="text-[#ff6f00]">Monmarché</span></p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
          <Link href="/conditions" className="block hover:underline text-[#ff6f00]">Conditions générales</Link>
          <Link href="/confidentialite" className="block hover:underline text-[#ff6f00]">Confidentialité</Link>
          <Link href="/a-propos" className="block hover:underline text-[#ff6f00]">À propos</Link>
          <Link href="/blog" className="block hover:underline text-[#ff6f00]">Blog</Link>
        </div>

        {/* Extras */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Extras</h3>
          <p>Vidéo de présentation disponible</p>
          <a href="https://wa.me/004929258777" className="text-[#ff6f00] hover:underline">WhatsApp Monmarché</a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Monmarché – Tous droits réservés. Conçu avec ❤️ en Guinée.
      </div>
    </footer>
  );
}
