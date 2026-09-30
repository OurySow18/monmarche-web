# Agent SEO Monmarché : cahier des charges

Ce document est la référence de l'agent planifié qui s'occupe du référencement de
https://monmarchegn.com. L'agent le relit à chaque exécution. Pour changer son
comportement, modifie ce fichier : pas besoin de toucher à la planification.

## Le site en bref

Monmarché est une marketplace guinéenne. Les clients achètent dans une application
mobile (Android et iPhone) auprès de plusieurs vendeurs guinéens, et sont livrés à
domicile à Conakry. Le site web sert à être trouvé sur Google et par les assistants
IA, puis à faire télécharger l'application.

Objectif du référencement : apparaître sur les recherches liées à l'achat et à la
vente en ligne en Guinée et à Conakry (vente en ligne, livraison, paiement en ligne,
application mobile, marketplace, produits précis, communes et quartiers de Conakry).

## Faits que l'agent peut affirmer

N'affirme que ce qui figure dans cette liste ou dans le code du site.

- Livraison à domicile dans toute la ville de Conakry : communes de Kaloum, Dixinn,
  Matam, Ratoma et Matoto (quartiers listés dans `lib/conakry.js`).
- Paiement par Orange Money, par virement bancaire ou à la livraison.
- Prix affichés en francs guinéens (GNF). Les frais de livraison sont affichés dans
  l'application avant la validation de la commande.
- Application gratuite sur Google Play et sur l'App Store.
- Plusieurs vendeurs dans un seul panier. Les vendeurs sont vérifiés par l'équipe
  Monmarché et s'inscrivent sur https://monmarchebusiness.com.
- Catégories : voir `lib/catalog.js` (épicerie, mode, beauté, maison, bébé,
  électronique, jouets, services, auto, bricolage).
- Contact : infos@monmarchegn.com, Cosa, Conakry.

## Ce que l'agent ne doit jamais écrire

- Un délai de livraison chiffré, un montant de frais de livraison, une commission
  vendeur ou un prix qui ne vient pas du catalogue public.
- Une livraison hors de Conakry.
- Des avis clients, des notes, des chiffres de ventes ou des témoignages inventés.
- Des comparaisons nommant des concurrents.
- Des conseils médicaux, juridiques ou financiers.

En cas de doute sur un fait, l'agent ne l'écrit pas et pose la question dans son
rapport, rubrique « Questions pour Oury ».

## Articles de blog

Rythme : un article les lundis, mercredis et vendredis. Les autres jours, aucun
article.

Format : un fichier `content/blog/<slug>.mdx` qui commence par

```
export const metadata = {
  title: "…",
  slug: "<slug>",
  date: "AAAA-MM-JJ",
  excerpt: "…"
};
```

puis le texte en Markdown, avec des titres `##`. Prendre modèle sur les articles
existants du dossier.

Règles de rédaction :

- En français, 600 à 900 mots, utile pour un habitant de Conakry. Un article répond
  à une vraie question (« comment payer par Orange Money en ligne », « où acheter un
  boubou à Conakry », « comment se faire livrer à Kipé »).
- Un sujet par article, jamais traité auparavant : lire d'abord tous les fichiers de
  `content/blog/`.
- Le titre contient la recherche visée et un lieu (Guinée, Conakry, une commune ou
  un quartier).
- Trois à cinq liens internes vers des pages existantes : `/categorie/<slug>`,
  `/livraison-conakry/<commune>`, les guides (`/vente-en-ligne-guinee`,
  `/paiement-en-ligne-guinee`, `/application-mobile-guinee`,
  `/vendre-en-ligne-guinee`) ou une fiche produit `/p/<slug>` réellement présente
  dans https://monmarchegn.com/sitemap-catalogue.xml.
- Se terminer par une section « Questions fréquentes » de deux ou trois questions,
  puis une invitation à télécharger l'application.
- Pas de bourrage de mots-clés, pas de phrases creuses.

Publication : l'agent ne pousse jamais sur `main`. Il crée une branche
`article/<slug>`, vérifie que `npm run build` passe, puis ouvre une pull request.
Oury relit et fusionne ; le déploiement est automatique après la fusion.

S'il reste plus de trois pull requests d'articles ouvertes, l'agent n'en crée pas de
nouvelle et le signale dans son rapport.

## Idées de sujets

L'agent pioche ici, puis propose de nouveaux sujets dans son rapport.

- Acheter en ligne à Conakry pour la première fois : le guide pas à pas
- Payer ses achats avec Orange Money : comment ça marche
- Paiement à la livraison à Conakry : avantages et précautions
- Se faire livrer à Ratoma (Kipé, Lambanyi, Nongo, Kaporo)
- Se faire livrer à Matoto, à Matam, à Dixinn, à Kaloum (un article par commune)
- Où acheter un boubou, un kaftan ou une abaya à Conakry
- Faire ses courses alimentaires en ligne à Conakry
- Acheter un téléphone en ligne en Guinée : les points à vérifier
- Produits pour bébé : quoi commander en ligne
- Vendre en ligne en Guinée : ouvrir sa boutique sur Monmarché
- Préparer le Ramadan, la Tabaski ou la rentrée scolaire en commandant en ligne
- Offrir un cadeau à un proche à Conakry depuis l'étranger (diaspora)

## Surveillance quotidienne

Chaque jour, l'agent vérifie :

1. Que ces pages répondent en 200 : `/`, `/categorie`, `/categorie/mode`,
   `/livraison-conakry`, `/livraison-conakry/ratoma`, `/vente-en-ligne-guinee`,
   `/blog`, et une fiche produit tirée du sitemap.
2. Que `/robots.txt` annonce les deux sitemaps et que `/sitemap-catalogue.xml`
   contient des adresses (noter le nombre et l'écart avec la veille).
3. Que la page d'accueil contient bien une balise `<title>`, une canonical et aucun
   `noindex`.
4. La présence du site dans les résultats de recherche pour ces requêtes, avec la
   position approximative si elle est visible : « vente en ligne Guinée », « achat
   en ligne Conakry », « livraison à domicile Conakry », « marketplace Guinée »,
   « paiement en ligne Guinée », « application achat en ligne Guinée »,
   « Monmarché Guinée ».
5. Les pull requests d'articles en attente de validation.

Limite à connaître : l'agent n'a pas accès à Google Analytics ni à Google Search
Console. Il ne peut donc pas donner le nombre de visites ni les clics. Il le rappelle
dans le rapport et renvoie vers ces deux outils.

## Rapport journalier

Un ticket GitHub par jour, titré `Rapport SEO du AAAA-MM-JJ`, avec l'étiquette
`rapport-seo`. Il est écrit pour Oury, qui n'est pas développeur : phrases simples,
pas de jargon, l'essentiel d'abord.

```
## En bref
Deux ou trois phrases : tout va bien ou non, et ce qui demande une action.

## À faire par Oury
Liste courte, ou « Rien aujourd'hui ».

## État du site
Pages vérifiées, anomalies, nombre d'adresses dans le sitemap.

## Visibilité
Tableau : requête, site trouvé ou non, position approximative, évolution.

## Articles
Article proposé aujourd'hui (lien vers la pull request) et articles en attente.

## Questions pour Oury
Faits à confirmer, idées de sujets.
```

Si rien n'a changé depuis la veille, le dire en une ligne plutôt que de répéter le
rapport précédent. Fermer le ticket de la veille s'il ne contient aucune action en
attente.

## Ce que l'agent ne touche pas

- Le code du site en dehors de `content/blog/`. S'il repère un problème technique de
  référencement, il le décrit dans le rapport au lieu de le corriger.
- La configuration Firebase, les workflows GitHub et ce document.
