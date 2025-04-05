"use client";

import React from 'react';

export default function ConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Conditions Générales de Vente</h1>

      <p className="mb-4">
        Les présentes conditions générales régissent les ventes et les livraisons effectuées via l&apos;application Monmarché.
        En passant commande sur notre plateforme, vous acceptez les conditions ci-dessous.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Produits</h2>
      <p className="mb-4">
        Tous les produits proposés sont disponibles dans la limite des stocks. Monmarché s&apos;engage à fournir des produits frais
        et conformes aux normes d’hygiène et de sécurité en vigueur.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. Commandes</h2>
      <p className="mb-4">
        Les commandes se font via l&apos;application mobile. Le client est responsable de l&apos;exactitude des informations fournies
        lors de la commande.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Livraison</h2>
      <p className="mb-4">
        La livraison est assurée à Conakry et bientôt dans d&apos;autres régions. Monmarché s&apos;efforce de respecter les délais de
        livraison, mais ne pourra être tenu responsable en cas de force majeure.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Paiement</h2>
      <p className="mb-4">
        Le paiement s’effectue via Orange Money ou par virement bancaire. Toute commande est considérée comme valide
        uniquement après confirmation du paiement.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Réclamations et retours</h2>
      <p className="mb-4">
        Toute réclamation doit être adressée dans un délai de 24h après la réception. Les retours sont acceptés uniquement
        pour les produits défectueux ou non conformes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Données personnelles</h2>
      <p className="mb-4">
        Les informations collectées sont utilisées uniquement dans le cadre de la commande et du service client. Consultez notre
        Politique de Confidentialité pour plus de détails.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">7. Modifications</h2>
      <p className="mb-4">
        Monmarché se réserve le droit de modifier les présentes conditions à tout moment. Les conditions applicables sont celles
        en vigueur au moment de la commande.
      </p>

      <p className="mt-8 text-sm text-gray-500">Dernière mise à jour : mars 2025</p>
    </div>
  );
}
