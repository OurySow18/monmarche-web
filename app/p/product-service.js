import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://monmarchegn.com";
export const FALLBACK_IMAGE =
  process.env.NEXT_PUBLIC_OG_FALLBACK_IMAGE ||
  `${SITE_URL}/images/og-monmarche.png`;

const FIRESTORE_COLLECTION =
  process.env.FIRESTORE_PRODUCTS_COLLECTION || "products_public";

/**
 * Récupère un produit depuis Firestore (si credentials fournis), sinon via API, sinon mock local.
 */
export async function getProduct(identifier) {
  if (!identifier) return null;

  // 1) Recherche par slug (nouvel usage)
  const fromSlug = await getProductBySlug(identifier);
  if (fromSlug) return fromSlug;

  // 2) Recherche par ID (compatibilité legacy)
  const fromFirestore = await getProductFromFirestore(identifier);
  if (fromFirestore) return fromFirestore;

  // 3) Firestore via REST + apiKey/public config (si règles ouvertes à la lecture)
  const fromFirestoreRest = await getProductFromFirestoreRest(identifier);
  if (fromFirestoreRest) return fromFirestoreRest;

  // 4) API HTTP (optionnel)
  const fromApi = await getProductFromApi(identifier);
  if (fromApi) return fromApi;

  // 5) Mock pour démo/test local
  return normalizeProduct({
    productId: identifier,
    tags: { title: `Produit ${identifier}` },
    description:
      "Description courte du produit Monmarché. Remplacez par votre champ description courte.",
    image: `${SITE_URL}/images/og-monmarche.png`,
  });
}

async function getProductBySlug(slug) {
  if (!slug) return null;

  const fromFirestore = await getProductFromFirestoreBySlug(slug);
  if (fromFirestore) return fromFirestore;

  const fromFirestoreRest = await getProductFromFirestoreRestBySlug(slug);
  if (fromFirestoreRest) return fromFirestoreRest;

  return null;
}

async function getProductFromFirestore(productId) {
  const hasCreds =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;
  if (!hasCreds) return null;

  try {
    const db = await getDb();
    const direct = await db
      .collection(FIRESTORE_COLLECTION)
      .doc(productId)
      .get();
    if (direct.exists) {
      return normalizeProduct({ id: direct.id, ...direct.data() });
    }

    const querySnap = await db
      .collection(FIRESTORE_COLLECTION)
      .where("productId", "==", productId)
      .limit(1)
      .get();
    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      return normalizeProduct({ id: doc.id, ...doc.data() });
    }
  } catch (err) {
    // On laisse tomber silencieusement pour retomber sur API ou mock
  }
  return null;
}

async function getProductFromFirestoreBySlug(slug) {
  const hasCreds =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;
  if (!hasCreds) return null;

  try {
    const db = await getDb();
    const querySnap = await db
      .collection(FIRESTORE_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      return normalizeProduct({ id: doc.id, ...doc.data() });
    }
  } catch (err) {
    // On laisse tomber silencieusement pour retomber sur API ou mock
  }
  return null;
}

async function getProductFromFirestoreRest(productId) {
  const projectId = process.env.NEXT_PUBLIC_FB_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FB_API_KEY;
  if (!projectId || !apiKey) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${FIRESTORE_COLLECTION}/${productId}?key=${apiKey}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const doc = await res.json();
    if (!doc || !doc.fields) return null;
    const parsed = firestoreDocToPlain(doc);
    return normalizeProduct({ id: doc.name?.split("/").pop(), ...parsed });
  } catch (err) {
    return null;
  }
}

async function getProductFromFirestoreRestBySlug(slug) {
  const projectId = process.env.NEXT_PUBLIC_FB_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FB_API_KEY;
  if (!projectId || !apiKey) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
  console.log("[product] REST slug lookup", {
    slug,
    projectId,
    hasApiKey: Boolean(apiKey),
  });
  const body = {
    structuredQuery: {
      from: [{ collectionId: FIRESTORE_COLLECTION }],
      where: {
        fieldFilter: {
          field: { fieldPath: "slug" },
          op: "EQUAL",
          value: { stringValue: slug },
        },
      },
      limit: 1,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    console.log("[product] REST slug response", {
      slug,
      status: res.status,
      ok: res.ok,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const doc = data?.[0]?.document;
    console.log("[product] REST slug doc", {
      slug,
      hasDocument: Boolean(doc),
    });
    if (!doc?.fields) return null;
    const parsed = firestoreDocToPlain(doc);
    return normalizeProduct({ id: doc.name?.split("/").pop(), ...parsed });
  } catch (err) {
    console.log("[product] REST slug error", { slug, error: err?.message });
    return null;
  }
}

async function getProductFromApi(productId) {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/products/${productId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return normalizeProduct(data);
    }
  } catch (err) {
    return null;
  }
  return null;
}

async function getDb() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!privateKey || !projectId || !clientEmail) {
    throw new Error("Missing Firebase Admin credentials");
  }

  const pk = privateKey.replace(/\\n/g, "\n");
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: pk,
      }),
    });
  }
  return getFirestore();
}

function firestoreDocToPlain(doc) {
  const fields = doc.fields || {};
  const plain = {};
  for (const key of Object.keys(fields)) {
    plain[key] = decodeFirestoreValue(fields[key]);
  }
  return plain;
}

function decodeFirestoreValue(value) {
  if (!value || typeof value !== "object") return value;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return Boolean(value.booleanValue);
  if ("mapValue" in value) {
    const out = {};
    const m = value.mapValue.fields || {};
    for (const k of Object.keys(m)) {
      out[k] = decodeFirestoreValue(m[k]);
    }
    return out;
  }
  if ("arrayValue" in value) {
    const arr = value.arrayValue.values || [];
    return arr.map(decodeFirestoreValue);
  }
  return null;
}

export function normalizeProduct(raw) {
  if (!raw) return null; 
  const tags = raw.tags || {};
  const id = raw.productId || raw.id;
  const slug = raw.slug || tags.slug || raw.handle;
  const title = tags.title || raw.title || raw.name;
  const description = raw.description || tags.description || raw.excerpt;
  const image =
    toAbsoluteUrl(
        raw.media?.cover ||
        raw.image ||
        raw.cover ||
        tags.image ||
        tags.mainImage ||
        tags.cover
    ) || FALLBACK_IMAGE;
  const price = normalizePriceValue(
    raw.price ??
      raw.priceAmount ??
      raw.unitPrice ??
      raw.pricing?.basePrice ??
      raw.pricing?.price ??
      raw.pricing?.amount ??
      tags.price
  );
  const currency =
    raw.pricing?.currency || raw.currency || raw.priceCurrency || tags.currency;
  const urlSlug = slug || id;

  return {
    id,
    slug,
    title,
    description,
    image,
    price,
    currency,
    url: raw.url || `${SITE_URL}/p/${urlSlug}`,
  };
}

export function buildProductMetadata(product, identifier, options = {}) {
  const slugOrId = product?.slug || identifier || "";
  const url = `${SITE_URL}/p/${slugOrId}`;
  const isNotFound = options.notFound === true;
  const title = isNotFound
    ? "Produit introuvable — Monmarché"
    : product?.title ||
      (identifier
        ? `Produit ${identifier}`
        : "Monmarché — Découvrez nos produits frais livrés");
  const description = (product?.description || "").trim();
  const safeDescription =
    description.length > 0
      ? description.slice(0, 160)
      : "Produits frais livrés rapidement avec Monmarché. Commandez en ligne en quelques minutes.";
  const image = product?.image || FALLBACK_IMAGE;
  const other = {
    "og:type": "product",
  };

  if (product?.price && product?.currency) {
    other["og:price:amount"] = String(product.price);
    other["og:price:currency"] = String(product.currency);
  }

  return {
    title,
    description: safeDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      siteName: "Monmarché",
      title,
      description: safeDescription,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: safeDescription,
      images: [image],
    },
    other,
  };
}

function normalizePriceValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const normalized = Number.parseFloat(value.replace(",", "."));
    return Number.isFinite(normalized) ? normalized : null;
  }
  return null;
}

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const trimmed = url.startsWith("/") ? url : `/${url}`;
  return `${SITE_URL}${trimmed}`;
}
