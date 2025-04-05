"use client";

import React from 'react';

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">À propos de Monmarché</h1>

      <p className="mb-4">
        Monmarché est une application mobile innovante dédiée à la vente et à la livraison de produits alimentaires en Guinée.
        Notre objectif est de rendre les courses plus simples, plus rapides et accessibles à tous, grâce au digital.
      </p>

      <p className="mb-4">
        Lancée à Conakry, Monmarché répond à un besoin essentiel : permettre aux familles, aux professionnels et aux particuliers
        de commander des produits frais, variés et de qualité, sans quitter leur domicile. Notre plateforme propose une large sélection
        d’articles allant du riz aux produits pour enfants, en passant par les produits laitiers, jus, conserves, et bien plus.
      </p>

      <p className="mb-4">
        Nous nous engageons à assurer :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Une livraison rapide et fiable à Conakry</li>
        <li>Un service client réactif</li>
        <li>Des produits respectant les normes d’hygiène et de sécurité</li>
        <li>Un paiement facile via Orange Money ou virement bancaire</li>
      </ul>

      <p className="mb-4">
        Notre ambition est de devenir la référence de l’e-commerce alimentaire en Guinée, en mettant la technologie au service
        du quotidien. Avec Monmarché, gagnez du temps et commandez en toute confiance.
      </p>

      <p className="mt-8 text-sm text-gray-500">Dernière mise à jour : mars 2025</p>
    </div>
  );
}
