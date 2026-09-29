// Pages thématiques : une par intention de recherche (vente en ligne,
// paiement, application, vendre). Les variantes par lieu sont couvertes par
// les pages communes (/livraison-conakry/:commune), reliées depuis chaque guide.
export const GUIDES = [
  {
    slug: "vente-en-ligne-guinee",
    nav: "Achat en ligne en Guinée",
    title: "Vente et achat en ligne en Guinée : la marketplace de Conakry",
    description:
      "Achetez en ligne en Guinée auprès de vendeurs guinéens : épicerie, mode, beauté, maison, électronique. Livraison à domicile à Conakry, paiement Orange Money ou à la livraison.",
    h1: "Vente et achat en ligne en Guinée",
    intro:
      "Monmarché est une marketplace guinéenne : une seule application pour acheter en ligne auprès de nombreux vendeurs de Conakry, comparer les prix en francs guinéens et se faire livrer à domicile.",
    sections: [
      {
        h2: "Acheter des produits en ligne à Conakry",
        paragraphs: [
          "Plus besoin de traverser la ville jusqu'au marché de Madina ou de faire le tour des boutiques : sur Monmarché, vous trouvez des centaines de produits vendus par des commerçants guinéens, classés par catégorie, avec leurs prix et leurs photos.",
          "Vous pouvez remplir un seul panier chez plusieurs vendeurs. Monmarché coordonne la livraison et vous tient informé du suivi de votre commande.",
        ],
      },
      {
        h2: "Que peut-on acheter en ligne en Guinée ?",
        categories: true,
      },
      {
        h2: "Pourquoi acheter sur Monmarché plutôt qu'ailleurs ?",
        list: [
          "Des vendeurs guinéens vérifiés avant d'être publiés sur la marketplace.",
          "Des prix affichés en francs guinéens (GNF), frais de livraison indiqués avant de valider.",
          "Paiement par Orange Money, virement bancaire ou à la livraison.",
          "Livraison à domicile dans toutes les communes de Conakry.",
          "Un service client joignable par e-mail et WhatsApp.",
        ],
      },
    ],
    faq: [
      {
        q: "Quel est le meilleur site de vente en ligne en Guinée ?",
        a: "Monmarché est une marketplace guinéenne qui réunit de nombreux vendeurs dans une seule application, avec livraison à domicile à Conakry et paiement Orange Money ou à la livraison.",
      },
      {
        q: "Peut-on acheter en ligne à Conakry et être livré à domicile ?",
        a: "Oui. Avec Monmarché, vous commandez dans l'application et vous êtes livré chez vous ou au bureau, dans les communes de Kaloum, Dixinn, Matam, Ratoma et Matoto.",
      },
      {
        q: "Les prix sont-ils en francs guinéens ?",
        a: "Oui, tous les prix sont affichés en francs guinéens (GNF), et les frais de livraison sont indiqués avant la validation de la commande.",
      },
    ],
  },
  {
    slug: "paiement-en-ligne-guinee",
    nav: "Paiement en ligne",
    title: "Paiement en ligne en Guinée : Orange Money, virement ou à la livraison",
    description:
      "Comment payer ses achats en ligne en Guinée ? Sur Monmarché : Orange Money, virement bancaire ou paiement à la livraison à Conakry. Simple et sécurisé.",
    h1: "Paiement en ligne en Guinée : simple et sécurisé",
    intro:
      "Payer en ligne en Guinée ne doit pas être compliqué. Sur Monmarché, vous choisissez le mode de paiement qui vous convient, pour tous les vendeurs de votre panier.",
    sections: [
      {
        h2: "Les moyens de paiement acceptés",
        list: [
          "Orange Money : payez directement depuis votre téléphone au moment de la commande.",
          "Virement bancaire : pour les commandes importantes ou les professionnels.",
          "Paiement à la livraison : réglez en espèces ou par paiement mobile à la réception, partout à Conakry.",
        ],
      },
      {
        h2: "Un paiement sécurisé",
        paragraphs: [
          "Le montant total, frais de livraison compris, est affiché avant la validation. Vous ne payez que ce que vous avez vu. Après un paiement Orange Money, vous revenez automatiquement dans l'application pour suivre votre commande.",
          "Vous préférez vérifier votre colis avant de payer ? Choisissez le paiement à la livraison.",
        ],
      },
    ],
    faq: [
      {
        q: "Peut-on payer avec Orange Money sur Monmarché ?",
        a: "Oui. Orange Money est accepté pour payer vos commandes en ligne dans l'application Monmarché.",
      },
      {
        q: "Peut-on payer à la livraison à Conakry ?",
        a: "Oui. Le paiement à la livraison est possible dans toutes les communes de Conakry desservies par Monmarché.",
      },
      {
        q: "Le paiement en ligne est-il sûr en Guinée ?",
        a: "Sur Monmarché, le montant est affiché avant la validation et le paiement Orange Money passe par la plateforme officielle d'Orange. Vous pouvez aussi payer à la réception.",
      },
    ],
  },
  {
    slug: "application-mobile-guinee",
    nav: "Application mobile",
    title: "Application mobile d'achat en ligne en Guinée : Monmarché (Android, iPhone)",
    description:
      "Téléchargez Monmarché, l'application guinéenne pour acheter en ligne et se faire livrer à Conakry. Gratuite sur Android (Google Play) et iPhone (App Store).",
    h1: "Monmarché, l'application mobile pour acheter en Guinée",
    intro:
      "Monmarché est une application mobile guinéenne gratuite, disponible sur Android et iPhone. Elle permet d'acheter en ligne auprès de vendeurs de Conakry et de se faire livrer à domicile.",
    appButtons: true,
    sections: [
      {
        h2: "Ce que vous pouvez faire avec l'application",
        list: [
          "Parcourir les produits de nombreux vendeurs guinéens par catégorie.",
          "Remplir un seul panier chez plusieurs vendeurs.",
          "Payer par Orange Money, virement ou à la livraison.",
          "Suivre votre commande jusqu'à votre porte.",
          "Partager un produit avec vos proches par WhatsApp ou SMS.",
        ],
      },
      {
        h2: "Compatible avec tous les téléphones",
        paragraphs: [
          "L'application fonctionne sur les smartphones Android (Google Play) et sur iPhone (App Store). Elle est gratuite : vous ne payez que vos achats et la livraison.",
        ],
      },
    ],
    faq: [
      {
        q: "Quelle application pour acheter en ligne en Guinée ?",
        a: "Monmarché est une application guinéenne gratuite (Android et iPhone) pour acheter en ligne auprès de vendeurs de Conakry, avec livraison à domicile.",
      },
      {
        q: "L'application Monmarché est-elle gratuite ?",
        a: "Oui, le téléchargement et l'utilisation sont gratuits. Vous payez uniquement vos produits et les frais de livraison.",
      },
    ],
  },
  {
    slug: "vendre-en-ligne-guinee",
    nav: "Vendre en ligne",
    title: "Vendre en ligne en Guinée : ouvrez votre boutique sur la marketplace Monmarché",
    description:
      "Commerçant à Conakry ? Vendez en ligne sur Monmarché, la marketplace guinéenne : boutique en ligne, clients dans tout Conakry, livraison prise en charge, paiement Orange Money.",
    h1: "Vendre en ligne en Guinée avec Monmarché",
    intro:
      "Vous êtes commerçant, artisan ou marque en Guinée ? Monmarché vous permet de vendre en ligne sans créer votre propre site : vous publiez vos produits sur la marketplace et touchez des clients dans tout Conakry.",
    sections: [
      {
        h2: "Pourquoi vendre sur une marketplace guinéenne ?",
        list: [
          "Votre boutique en ligne avec sa propre page, partageable sur WhatsApp et les réseaux sociaux.",
          "Des clients dans les cinq communes de Conakry, sans ouvrir de nouveau magasin.",
          "La livraison coordonnée par Monmarché.",
          "Vos paiements reçus sur Orange Money.",
        ],
      },
      {
        h2: "Comment ouvrir votre boutique ?",
        steps: [
          "Contactez-nous à infos@monmarchegn.com ou sur WhatsApp.",
          "Créez votre compte vendeur et fournissez les documents demandés.",
          "Après validation, publiez vos produits avec photos et prix en GNF.",
          "Recevez vos commandes et préparez-les pour la livraison.",
        ],
      },
    ],
    faq: [
      {
        q: "Comment vendre en ligne en Guinée ?",
        a: "Le plus simple est de rejoindre une marketplace comme Monmarché : vous publiez vos produits, Monmarché vous apporte des clients à Conakry et coordonne la livraison.",
      },
      {
        q: "Faut-il un site internet pour vendre sur Monmarché ?",
        a: "Non. Votre boutique est hébergée sur Monmarché et dispose de sa propre page, que vous pouvez partager avec vos clients.",
      },
    ],
  },
];

export function getGuide(slug) {
  return GUIDES.find((guide) => guide.slug === slug) || null;
}
