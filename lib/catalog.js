import {
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

function isVisible(raw) {
  return (
    raw.status === "active" &&
    raw.mm_status !== false &&
    raw.vm_status !== false &&
    Boolean(raw.slug || raw.productId || raw.id)
  );
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
      console.error(`Firestore list ${collection} failed`, res.status);
      break;
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

/**
 * Produits publiés (actifs et validés) avec leur catégorie, triés par nom.
 */
export async function listPublicProducts() {
  let raws = [];
  try {
    raws = await listCollection(PRODUCTS_COLLECTION, [
      "productId",
      "id",
      "slug",
      "title",
      "description",
      "media",
      "pricing",
      "topCategory",
      "category",
      "status",
      "mm_status",
      "vm_status",
      "vendorName",
      "vendorId",
      "brand",
      "updatedAt",
    ]);
  } catch (error) {
    console.error("listPublicProducts failed", error);
    return [];
  }

  const seen = new Set();
  const products = [];
  for (const raw of raws) {
    if (!isVisible(raw)) continue;
    const product = normalizeProduct({ ...raw, id: raw.productId || raw.id || raw.docId });
    if (!product?.title || seen.has(product.url)) continue;
    seen.add(product.url);
    products.push({
      ...product,
      title: product.title.trim(),
      categorySlug: categorySlugFor(raw),
      vendorName: raw.vendorName || "",
      vendorId: raw.vendorId || "",
      brand: typeof raw.brand === "string" ? raw.brand : raw.brand?.name || "",
      updatedAt: raw.updatedAt || raw.updateTime,
    });
  }

  return products.sort((a, b) => a.title.localeCompare(b.title, "fr"));
}

export async function listProductsByCategory(slug) {
  const products = await listPublicProducts();
  return products.filter((product) => product.categorySlug === slug);
}

/**
 * Vendeurs approuvés qui ont une page publique (/vendor/:slug).
 * Seuls les champs nécessaires au sitemap sont demandés.
 */
export async function listPublicVendors() {
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
}

export function formatPrice(price, currency = "GNF") {
  if (!price) return "";
  const amount = new Intl.NumberFormat("fr-FR").format(price);
  return `${amount} ${currency === "GNF" || !currency ? "GNF" : currency}`;
}
