"use client";

import React from 'react';

export default function ConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>

      <p className="mb-4">
        Chez Monmarché, nous respectons votre vie privée et nous engageons à protéger les données personnelles que vous nous confiez.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Données collectées</h2>
      <p className="mb-4">
        Nous collectons uniquement les données nécessaires à la gestion de vos commandes : nom, numéro de téléphone, adresse de livraison,
        email, et informations de paiement.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. Utilisation des données</h2>
      <p className="mb-4">
        Vos données sont utilisées exclusivement pour traiter vos commandes, vous contacter en cas de besoin, et améliorer nos services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Partage des données</h2>
      <p className="mb-4">
        Nous ne partageons vos données avec aucun tiers, sauf dans le cadre strict de la livraison et du traitement des paiements.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Sécurité</h2>
      <p className="mb-4">
        Nous mettons en place des mesures de sécurité pour protéger vos informations contre tout accès non autorisé ou utilisation abusive.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Vos droits</h2>
      <p className="mb-4">
        Vous avez le droit d&apos;accéder à vos données, de les modifier ou de demander leur suppression. Pour toute demande, contactez-nous à
        <a href="mailto:infos@monmarchegn.com" className="text-green-700 ml-1">infos@monmarchegn.com</a>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Cookies</h2>
      <p className="mb-4">
        Notre application peut utiliser des cookies uniquement à des fins techniques pour améliorer votre expérience utilisateur.
      </p>

      <p className="mt-8 text-sm text-gray-500">Dernière mise à jour : mars 2025</p>
    </div>
  );
}
