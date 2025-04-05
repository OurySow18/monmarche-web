"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Download, ShoppingCart, Truck, ShieldCheck, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col items-center justify-center text-center px-4 md:px-6 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#ff6f00]"
        >
          Vos courses livrées à domicile
        </motion.h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl max-w-xl">
          Produits frais, livraison rapide et paiement sécurisé. Partout à Conakry et bientôt en Guinée entière.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <a href="https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
            <Button className="text-lg px-6 py-3 w-full sm:w-auto">Télécharger sur Android</Button>
          </a>
          <a href="https://apps.apple.com/de/app/monmarche/id6479302215" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="text-lg px-6 py-3 w-full sm:w-auto">Télécharger sur iPhone</Button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-12">Pourquoi choisir Monmarché ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Feature icon={<ShoppingCart />} title="Large sélection de produits" description="Riz, jus, produits laitiers, pour enfants et plus encore." />
          <Feature icon={<Truck />} title="Livraison rapide" description="Service fiable à Conakry, bientôt dans toute la Guinée." />
          <Feature icon={<ShieldCheck />} title="Paiement sécurisé" description="Commandez et payez en toute sécurité en ligne ou à la livraison." />
          <Feature icon={<ShoppingCart />} title="Commandes personnalisées" description="Créez vos paniers selon vos préférences alimentaires." />
          <Feature icon={<ShieldCheck />} title="Sécurité alimentaire" description="Produits frais et respect des normes d&apos;hygiène." />
          <Feature icon={<PhoneCall />} title="Support dédié" description="Notre équipe répond à vos questions à tout moment." />
        </div>
      </section>

      {/* Vidéo Section */}
      <section className="py-16 px-4 md:px-6 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Découvrez Monmarché en vidéo</h2>
        <div className="max-w-4xl mx-auto aspect-video">
          <iframe
            className="w-full h-full rounded-xl shadow-md"
            src="https://www.youtube.com/embed/LZftTkQo4RY"
            title="Présentation Monmarché"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Blog Teaser Section */}
      <section className="py-16 px-4 md:px-6 bg-orange-50 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#ff6f00] mb-8">Nos derniers articles</h2>
        <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
          <BlogCard 
            title="5 astuces pour faire vos courses plus rapidement" 
            excerpt="Découvrez comment optimiser vos achats grâce à nos paniers personnalisés et commandes rapides." 
            slug="astuces-courses" 
          />
        </div>
        <div className="mt-8">
          <Link href="/blog">
            <Button className="bg-[#ff6f00] text-white px-6 py-3 hover:bg-orange-600">Voir tous les articles</Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#ff6f00] text-white text-center px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold">Simplifiez vos courses dès aujourd&apos;hui !</h2>
        <p className="mt-4 text-base sm:text-lg">Téléchargez Monmarché et profitez d&apos;une nouvelle façon de faire vos courses.</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <a href="https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
            <Button className="text-lg px-6 py-3 bg-white text-[#ff6f00] w-full sm:w-auto">Télécharger sur Android</Button>
          </a>
          <a href="https://apps.apple.com/de/app/monmarche/id6479302215" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="text-lg px-6 py-3 border-white text-[#ff6f00] w-full sm:w-auto">Télécharger sur iPhone</Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-10 px-4 text-center text-sm text-gray-600">
        <div className="max-w-4xl mx-auto grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-left">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
            <p>Email : <a href="mailto:infos@monmarchegn.com" className="text-[#ff6f00]">infos@monmarchegn.com</a></p>
            <p>Téléphone : +224 121229</p>
            <p>WhatsApp : <a href="https://wa.me/004929258777" target="_blank" className="text-[#ff6f00]">004929258777</a></p>
            <p>Adresse : Cosa, Conakry</p>
            <p>Heures : 09h - 17h</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Suivez-nous</h3>
            <p>Instagram : @monmarchegn</p>
            <p>TikTok : @monmarchegn</p>
            <p>Facebook : Monmarché</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Ressources</h3>
            <Link href="/conditions" className="text-[#ff6f00] block">Conditions générales</Link>
            <Link href="/confidentialite" className="text-[#ff6f00] block">Confidentialité</Link>
            <Link href="/a-propos" className="text-[#ff6f00] block">À propos</Link>
            <Link href="/blog" className="text-[#ff6f00] block">Blog</Link>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Extras</h3>
            <p>Vidéo de présentation ci-dessus</p>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>&copy; 2025 Monmarché. Tous droits réservés.</p>
          <div>Conçu avec ❤️ en Guinée</div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all h-full">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <div className="text-[#ff6f00] mb-4">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      </CardContent>
    </Card>
  );
}

function BlogCard({ title, excerpt, slug }) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all h-full">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <h3 className="text-xl font-semibold text-[#ff6f00] mb-2">{title}</h3>
        <p className="text-gray-600 flex-1">{excerpt}</p>
        <Link href={`/blog/${slug}`} className="mt-4 text-[#ff6f00] font-medium hover:underline">Lire l&apos;article →</Link>
      </CardContent>
    </Card>
  );
}
