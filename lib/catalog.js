import { cache } from "react";
import {
  FALLBACK_IMAGE,
  FB_API_KEY,
  FB_PROJECT_ID,
  firestoreDocToPlain,
  normalizeProduct,
} from "@/app/p/product-service";

const PRODUCTS_COLLECTION =
  process.env.FIRESTORE_PRODUCTS_COLLECTION || "products_public";
const VENDORS_COLLECTION =
  process.env.FIRESTORE_VENDORS_COLLECTION || "vendors";

// Le catalogue change peu souvent : une heure de cache suffit et évite
// de relire ~900 documents Firestore à chaque visite de Googlebot.
const REVALIDATE_SECONDS = 3600;

export const CATEGORIES = [
  {
    slug: "epicerie",
    keys: ["grocery"],
    name: "Épicerie et alimentation",
    short: "Épicerie",
    intro:
      "Riz, huile, lait, jus, biscuits, conserves et produits frais : faites vos courses alimentaires en ligne et recevez-les à domicile à Conakry.",
  },
  {
    slug: "mode",
    keys: ["fashion"],
    // Les vêtements passent avant les accessoires (cartables, sacs) dans les aperçus.
    previewOrder: [
      "fashion_boubou",
      "fashion_kaftan",
      "fashion_abaya",
      "fashion_shirt",
      "fashion_pants",
      "fashion_shoes",
    ],
    name: "Mode et vêtements",
    short: "Mode",
    intro:
      "Boubous, kaftans, abayas, pantalons, chaussures et accessoires proposés par des vendeurs guinéens, livrés partout à Conakry.",
  },
  {
    slug: "beaute",
    keys: ["beauty"],
    name: "Beauté et soins",
    short: "Beauté",
    intro:
      "Parfums, cosmétiques, savons et produits de soin : achetez vos produits de beauté en ligne en Guinée avec livraison à Conakry.",
  },
  {
    slug: "maison",
    keys: ["home"],
    name: "Maison et électroménager",
    short: "Maison",
    intro:
      "Meubles, lustres, ustensiles de cuisine et petit électroménager pour équiper votre maison, livrés à Conakry.",
  },
  {
    slug: "bebe",
    keys: ["baby"],
    name: "Bébé et puériculture",
    short: "Bébé",
    intro:
      "Lait infantile, couches, soins et vêtements pour bébé : tout pour vos enfants, commandé en ligne et livré à Conakry.",
  },
  {
    slug: "electronique",
    keys: ["electronics"],
    name: "Électronique et téléphones",
    short: "Électronique",
    intro:
      "Téléphones, télévisions, ordinateurs et audio : achetez votre électronique en ligne en Guinée, livraison à Conakry.",
  },
  {
    slug: "jeux-jouets",
    keys: ["games"],
    name: "Jeux et jouets",
    short: "Jouets",
    intro:
      "Jouets, voitures télécommandées, jeux éducatifs et puzzles pour les enfants, livrés à domicile à Conakry.",
  },
  {
    slug: "services",
    keys: ["services"],
    name: "Services",
    short: "Services",
    intro:
      "Services numériques et prestations proposés par des professionnels guinéens sur Monmarché.",
  },
  {
    slug: "auto-moto",
    keys: ["vehicles"],
    name: "Auto, moto et vélo",
    short: "Auto",
    intro:
      "Pièces auto, véhicules et vélos vendus par des vendeurs de Conakry.",
  },
  {
    slug: "bricolage",
    keys: ["diy", "media"],
    name: "Bricolage, livres et divers",
    short: "Divers",
    intro:
      "Outils de bricolage, livres et autres articles disponibles sur la marketplace Monmarché.",
  },
];

// Anciens produits migrés : pas de topCategory, seulement un libellé libre.
const LEGACY_CATEGORY_MAP = {
  SAVON: "beaute",
  ENFANT: "bebe",
  ENFANTS: "bebe",
  "SAC à MAIN": "mode",
  INSECTICIDE: "maison",
};

export function getCategory(slug) {
  return CATEGORIES.find((category) => category.slug === slug) || null;
}

function categorySlugFor(raw) {
  if (raw.topCategory) {
    const match = CATEGORIES.find((category) =>
      category.keys.includes(raw.topCategory)
    );
    return match ? match.slug : null;
  }
  const legacy = String(raw.category || "").trim();
  return LEGACY_CATEGORY_MAP[legacy] || "epicerie";
}

// Règle métier : un produit n'est affiché que s'il est actif et validé à la fois
// par Monmarché (mm_status) et par le vendeur (vm_status).
function isVisible(raw) {
  return (
    raw.status === "active" &&
    raw.mm_status === true &&
    raw.vm_status === true &&
    Boolean(raw.slug || raw.productId || raw.id)
  );
}

// Garde le résultat en mémoire du serveur pendant REVALIDATE_SECONDS. Le cache de
// données de Next.js vit sur le disque de chaque instance Cloud Run : quand un robot
// fait démarrer de nouvelles instances, chacune relirait sinon tout le catalogue.
function memoize(load) {
  let value = null;
  let expiresAt = 0;
  return () => {
    if (!value || Date.now() > expiresAt) {
      expiresAt = Date.now() + REVALIDATE_SECONDS * 1000;
      // Un résultat vide (Firestore indisponible) n'est pas gardé : on réessaiera.
      value = load().then(
        (result) => {
          if (Array.isArray(result) && result.length === 0) value = null;
          return result;
        },
        (error) => {
          value = null;
          throw error;
        }
      );
    }
    return value;
  };
}

function toListedProduct(raw) {
  const product = normalizeProduct({ ...raw, id: raw.productId || raw.id || raw.docId });
  if (!product?.title) return null;
  return {
    ...product,
    title: product.title.trim(),
    categorySlug: categorySlugFor(raw),
    subCategory: raw.categoryId || "",
    vendorName: raw.vendorName || "",
    vendorId: raw.vendorId || "",
    brand: typeof raw.brand === "string" ? raw.brand : raw.brand?.name || "",
    updatedAt: raw.updatedAt || raw.updateTime,
  };
}

async function listCollection(collection, fieldPaths) {
  const docs = [];
  let pageToken = "";
  const mask = fieldPaths
    .map((path) => `&mask.fieldPaths=${encodeURIComponent(path)}`)
    .join("");

  do {
    const url =
      `https://firestore.googleapis.com/v1/projects/${FB_PROJECT_ID}/databases/(default)/documents/${collection}` +
      `?key=${FB_API_KEY}&pageSize=300${mask}` +
      (pageToken ? `&pageToken=${pageToken}` : "");
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      // Pas de liste partielle : elle serait mise en cache comme si elle était complète.
      throw new Error(`Firestore list ${collection} failed: ${res.status}`);
    }
    const json = await res.json();
    for (const doc of json.documents || []) {
      docs.push({
        docId: doc.name.split("/").pop(),
        updateTime: doc.updateTime,
        ...firestoreDocToPlain(doc),
      });
    }
    pageToken = json.nextPageToken || "";
  } while (pageToken);

  return docs;
}

const PRODUCT_FIELDS = [
  "productId",
  "id",
  "slug",
  "title",
  "description",
  "media",
  "pricing",
  "topCategory",
  "categoryId",
  "category",
  "status",
  "mm_status",
  "vm_status",
  "vendorName",
  "vendorId",
  "brand",
  "updatedAt",
];

/**
 * Produits publiés (actifs et validés) avec leur catégorie, triés par nom.
 * Lit tout le catalogue (~900 lectures) : réservé aux pages mises en cache
 * (accueil, catégories, sitemap), jamais à une page générée à chaque visite.
 */
export const listPublicProducts = memoize(async () => {
  let raws = [];
  try {
    raws = await listCollection(PRODUCTS_COLLECTION, PRODUCT_FIELDS);
  } catch (error) {
    console.error("listPublicProducts failed", error);
    return [];
  }

  const seen = new Set();
  const products = [];
  for (const raw of raws) {
    if (!isVisible(raw)) continue;
    const product = toListedProduct(raw);
    if (!product || seen.has(product.url)) continue;
    seen.add(product.url);
    products.push(product);
  }

  return products.sort((a, b) => a.title.localeCompare(b.title, "fr"));
});

/**
 * Contexte d'une fiche produit : publication, catégorie et au plus 8 produits
 * similaires. Une seule requête limitée à 24 documents, au lieu du catalogue entier.
 */
export const getProductContext = cache(async function getProductContext(product) {
  const listing = product?.listing || {};
  const listed = isVisible({ ...listing, slug: product?.slug, id: product?.id });
  const categorySlug = categorySlugFor(listing);
  const category = getCategory(categorySlug);

  const filterField = listing.topCategory ? "topCategory" : "category";
  const filterValue = listing.topCategory || listing.category;
  if (!listed || !filterValue) return { listed, category, related: [] };

  const url = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT_ID}/databases/(default)/documents:runQuery?key=${FB_API_KEY}`;
  const body = {
    structuredQuery: {
      from: [{ collectionId: PRODUCTS_COLLECTION }],
      select: { fields: PRODUCT_FIELDS.map((fieldPath) => ({ fieldPath })) },
      where: {
        fieldFilter: {
          field: { fieldPath: filterField },
          op: "EQUAL",
          value: { stringValue: filterValue },
        },
      },
      limit: 24,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return { listed, category, related: [] };
    const rows = await res.json();
    const related = rows
      .map((row) => row.document)
      .filter(Boolean)
      .map((doc) => ({ docId: doc.name.split("/").pop(), ...firestoreDocToPlain(doc) }))
      .filter(isVisible)
      .map(toListedProduct)
      .filter((item) => item && item.url !== product.url && item.id !== product.id)
      .slice(0, 8);
    return { listed, category, related };
  } catch (error) {
    console.error("getProductContext failed", error);
    return { listed, category, related: [] };
  }
});

/**
 * Sélection vitrine : produits avec photo et prix, pris à tour de rôle dans
 * chaque catégorie pour montrer la variété du catalogue.
 */
export function pickFeatured(products, count = 8) {
  const byCategory = new Map();
  const recent = [...products]
    .filter((product) => product.price && product.image && product.image !== FALLBACK_IMAGE)
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  for (const product of recent) {
    if (!byCategory.has(product.categorySlug)) byCategory.set(product.categorySlug, []);
    byCategory.get(product.categorySlug).push(product);
  }
  // Dans chaque catégorie, les sous-catégories de previewOrder passent en premier
  // (le tri est stable : à rang égal, le plus récent reste devant).
  const queues = [...byCategory.entries()].map(([slug, items]) => {
    const order = getCategory(slug)?.previewOrder || [];
    const rank = (sub) => (order.includes(sub) ? order.indexOf(sub) : order.length);
    return items.sort((a, b) => rank(a.subCategory) - rank(b.subCategory));
  });
  const picked = [];
  while (picked.length < count && queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      if (queue.length && picked.length < count) picked.push(queue.shift());
    }
  }
  return picked;
}

/**
 * Aperçu d'une catégorie : un produit par sous-catégorie, les plus
 * représentatives d'abord (previewOrder), pour ne pas montrer un rayon
 * secondaire ni trois articles presque identiques.
 */
export function pickPreviews(products, category, count = 3) {
  const order = category?.previewOrder || [];
  const rank = (sub) => (order.includes(sub) ? order.indexOf(sub) : order.length);
  const bySub = new Map();
  for (const product of pickFeatured(products, products.length)) {
    if (!bySub.has(product.subCategory)) bySub.set(product.subCategory, []);
    bySub.get(product.subCategory).push(product);
  }
  const queues = [...bySub.entries()]
    .sort(([a, itemsA], [b, itemsB]) => rank(a) - rank(b) || itemsB.length - itemsA.length)
    .map(([, items]) => items);
  const picked = [];
  while (picked.length < count && queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      if (queue.length && picked.length < count) picked.push(queue.shift());
    }
  }
  return picked;
}

export async function listProductsByCategory(slug) {
  const products = await listPublicProducts();
  return products.filter((product) => product.categorySlug === slug);
}

/**
 * Vendeurs approuvés qui ont une page publique (/vendor/:slug).
 * Seuls les champs nécessaires au sitemap sont demandés.
 */
export const listPublicVendors = memoize(async () => {
  try {
    const raws = await listCollection(VENDORS_COLLECTION, [
      "slug",
      "status",
      "vendorStatus",
      "blocked",
      "updatedAt",
    ]);
    return raws
      .filter(
        (raw) =>
          raw.slug &&
          raw.blocked !== true &&
          (raw.vendorStatus === "approved" || raw.status === "approved")
      )
      .map((raw) => ({
        slug: raw.slug,
        updatedAt: raw.updatedAt || raw.updateTime,
      }));
  } catch (error) {
    console.error("listPublicVendors failed", error);
    return [];
  }
});

export function formatPrice(price, currency = "GNF") {
  if (!price) return "";
  const amount = new Intl.NumberFormat("fr-FR").format(price);
  return `${amount} ${currency === "GNF" || !currency ? "GNF" : currency}`;
}
