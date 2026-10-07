"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import StoreButtons from "./StoreButtons";

export default function Hero({ products = [], productCount = 0 }) {
  const mosaic = products.slice(0, 4);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50 px-6 py-12 sm:px-10 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary shadow-sm ring-1 ring-orange-100"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Marketplace guinéenne · Livraison à Conakry
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-gray-900"
          >
            Achetez en ligne en Guinée,{" "}
            <span className="text-primary">livré chez vous à Conakry</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-xl text-base sm:text-lg text-gray-700 lg:mx-0"
          >
            Épicerie, mode, beauté, maison, bébé et électronique :{" "}
            {productCount > 0 ? `plus de ${Math.floor(productCount / 50) * 50} produits` : "des centaines de produits"}{" "}
            de vendeurs guinéens dans une seule application. Payez par Orange Money ou à
            la livraison.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            <StoreButtons className="justify-center lg:justify-start" />
            <p className="text-sm text-gray-500">
              Gratuit ·{" "}
              <Link href="/categorie" className="font-medium text-primary hover:underline">
                Parcourir les produits
              </Link>
            </p>
          </motion.div>
        </div>

        {mosaic.length === 4 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {mosaic.map((product, index) => (
              <Link
                key={product.url}
                href={`/p/${product.slug || product.id}`}
                prefetch={false}
                className={`group relative aspect-square overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-orange-100 ${
                  index % 2 === 1 ? "translate-y-6" : ""
                }`}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index < 2}
                />
                <span className="absolute inset-x-2 bottom-2 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900 backdrop-blur line-clamp-1">
                  {product.title}
                </span>
              </Link>
            ))}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
