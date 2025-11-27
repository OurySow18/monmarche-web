"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col items-center justify-center text-center px-4 md:px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#ff6f00]"
      >
        Vos courses livrées à domicile
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 text-base sm:text-lg md:text-xl max-w-xl"
      >
        Produits de qualité, livraison rapide et paiement sécurisé. Partout à
        Conakry et bientôt dans toute la Guinée. Monmarche vous propose un service clientèle professionnel.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 flex flex-col sm:flex-row gap-4"
      >
        <a
          href="https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="text-lg px-6 py-3 w-full sm:w-auto">
            Télécharger sur Android
          </Button>
        </a>
        <a
          href="https://apps.apple.com/de/app/monmarche/id6479302215"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            className="text-lg px-6 py-3 w-full sm:w-auto"
          >
            Télécharger sur iPhone
          </Button>
        </a>
      </motion.div>
    </section>
  );
}
