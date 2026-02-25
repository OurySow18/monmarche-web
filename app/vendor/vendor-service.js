import {
  FALLBACK_IMAGE,
  SITE_URL,
  buildSocialMetadata,
  firestoreDocToPlain,
  getDb,
  toAbsoluteUrl,
  truncateMetaDescription,
} from "../p/product-service";

const FIRESTORE_VENDORS_COLLECTION =
  process.env.FIRESTORE_VENDORS_COLLECTION || "vendors";

export async function getVendorResult(vendorId) {
  if (!vendorId) {
    return {
      vendor: null,
      errorCode: "invalid_vendor_link",
      userMessage: "Le lien de boutique est invalide.",
    };
  }

  const rawResult = await getVendorRaw(vendorId);

  if (rawResult.errorCode) {
    return {
      vendor: null,
      errorCode: rawResult.errorCode,
      userMessage:
        rawResult.errorCode === "vendor_service_unavailable"
          ? "La boutique est temporairement indisponible. Réessayez plus tard."
          : "Une erreur est survenue lors du chargement de la boutique.",
    };
  }

  if (!rawResult.raw) {
    return {
      vendor: null,
      errorCode: "vendor_not_found",
      userMessage: "Cette boutique est introuvable.",
    };
  }

  if (!isVendorActive(rawResult.raw)) {
    return {
      vendor: null,
      errorCode: "vendor_inactive",
      userMessage: "Cette boutique n'est pas active pour le moment.",
    };
  }

  return {
    vendor: normalizeVendor(rawResult.raw),
    errorCode: null,
    userMessage: "",
  };
}

export async function getVendor(vendorId) {
  const result = await getVendorResult(vendorId);
  return result.vendor;
}

async function getVendorRawFromFirestoreById(vendorId) {
  const hasCreds =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;
  if (!hasCreds) {
    return { raw: null, errorCode: "vendor_service_unavailable" };
  }

  try {
    const db = await getDb();
    const direct = await db
      .collection(FIRESTORE_VENDORS_COLLECTION)
      .doc(vendorId)
      .get();
    if (direct.exists) {
      return { raw: { id: direct.id, ...direct.data() }, errorCode: null };
    }

    const querySnap = await db
      .collection(FIRESTORE_VENDORS_COLLECTION)
      .where("vendorId", "==", vendorId)
      .limit(1)
      .get();
    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      return { raw: { id: doc.id, ...doc.data() }, errorCode: null };
    }
  } catch (err) {
    return { raw: null, errorCode: "vendor_fetch_failed" };
  }

  return { raw: null, errorCode: null };
}

async function getVendorRaw(vendorId) {
  const fromSlug = await getVendorRawBySlug(vendorId);
  if (fromSlug.raw) return fromSlug;

  const fromFirestore = await getVendorRawFromFirestoreById(vendorId);
  if (fromFirestore.raw) return fromFirestore;

  const fromRest = await getVendorRawFromFirestoreRestById(vendorId);
  if (fromRest.raw) return fromRest;

  if (fromSlug.errorCode && fromFirestore.errorCode && fromRest.errorCode) {
    return { raw: null, errorCode: "vendor_service_unavailable" };
  }

  if (!fromSlug.errorCode) return fromSlug;
  if (!fromFirestore.errorCode) return fromFirestore;
  return fromRest;
}

async function getVendorRawBySlug(slug) {
  const fromFirestore = await getVendorRawFromFirestoreBySlug(slug);
  if (fromFirestore.raw) return fromFirestore;

  const fromRest = await getVendorRawFromFirestoreRestBySlug(slug);
  if (fromRest.raw) return fromRest;

  if (fromFirestore.errorCode && fromRest.errorCode) {
    return { raw: null, errorCode: "vendor_service_unavailable" };
  }

  return !fromFirestore.errorCode ? fromFirestore : fromRest;
}

async function getVendorRawFromFirestoreBySlug(slug) {
  const hasCreds =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;
  if (!hasCreds) {
    return { raw: null, errorCode: "vendor_service_unavailable" };
  }

  try {
    const db = await getDb();
    const querySnap = await db
      .collection(FIRESTORE_VENDORS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      return { raw: { id: doc.id, ...doc.data() }, errorCode: null };
    }
  } catch (err) {
    return { raw: null, errorCode: "vendor_fetch_failed" };
  }

  return { raw: null, errorCode: null };
}

async function getVendorRawFromFirestoreRestById(vendorId) {
  const projectId = process.env.NEXT_PUBLIC_FB_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FB_API_KEY;
  if (!projectId || !apiKey) {
    return { raw: null, errorCode: "vendor_service_unavailable" };
  }

  const directUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${FIRESTORE_VENDORS_COLLECTION}/${vendorId}?key=${apiKey}`;

  try {
    const directRes = await fetch(directUrl, { cache: "no-store" });
    if (directRes.ok) {
      const doc = await directRes.json();
      if (doc?.fields) {
        const parsed = firestoreDocToPlain(doc);
        return {
          raw: { id: doc.name?.split("/").pop(), ...parsed },
          errorCode: null,
        };
      }
    }
  } catch (err) {
    // fallback query
  }

  const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
  const body = {
    structuredQuery: {
      from: [{ collectionId: FIRESTORE_VENDORS_COLLECTION }],
      where: {
        fieldFilter: {
          field: { fieldPath: "vendorId" },
          op: "EQUAL",
          value: { stringValue: vendorId },
        },
      },
      limit: 1,
    },
  };

  try {
    const res = await fetch(queryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      return { raw: null, errorCode: "vendor_fetch_failed" };
    }
    const data = await res.json();
    const doc = data?.[0]?.document;
    if (!doc?.fields) {
      return { raw: null, errorCode: null };
    }
    const parsed = firestoreDocToPlain(doc);
    return {
      raw: { id: doc.name?.split("/").pop(), ...parsed },
      errorCode: null,
    };
  } catch (err) {
    return { raw: null, errorCode: "vendor_fetch_failed" };
  }
}

async function getVendorRawFromFirestoreRestBySlug(slug) {
  const projectId = process.env.NEXT_PUBLIC_FB_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FB_API_KEY;
  if (!projectId || !apiKey) {
    return { raw: null, errorCode: "vendor_service_unavailable" };
  }

  const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
  const body = {
    structuredQuery: {
      from: [{ collectionId: FIRESTORE_VENDORS_COLLECTION }],
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
    const res = await fetch(queryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      return { raw: null, errorCode: "vendor_fetch_failed" };
    }
    const data = await res.json();
    const doc = data?.[0]?.document;
    if (!doc?.fields) {
      return { raw: null, errorCode: null };
    }
    const parsed = firestoreDocToPlain(doc);
    return {
      raw: { id: doc.name?.split("/").pop(), ...parsed },
      errorCode: null,
    };
  } catch (err) {
    return { raw: null, errorCode: "vendor_fetch_failed" };
  }
}

export function normalizeVendor(raw) {
  if (!raw) return null;

  const id = raw.vendorId || raw.id;
  const slug = raw.slug || raw.handle;
  const profile = raw.profile || {};
  const shop = raw.shop || raw.store || {};
  const media = raw.media || {};
  const company = raw.company || {};

  const title =
    company.name ||
    raw.title ||
    raw.name ||
    raw.displayName ||
    raw.businessName ||
    shop.name ||
    profile.name ||
    (id ? `Boutique ${id}` : "Boutique Monmarché");

  const description =
    company.description ||
    raw.description ||
    raw.bio ||
    raw.summary ||
    shop.description ||
    profile.description ||
    "";

  const logo = toAbsoluteUrl(
    company.logoUrl ||
    company.logo ||
      raw.logo ||
      raw.logoUrl ||
      media.logo ||
      profile.logo ||
      shop.logo
  );
  const cover = toAbsoluteUrl(
    company.coverUrl ||
      company.cover ||
    raw.cover ||
      raw.coverUrl ||
      raw.hero ||
      raw.banner ||
      media.cover ||
      media.hero ||
      media.banner
  );
  const image = logo || cover || FALLBACK_IMAGE;

  return {
    id,
    slug,
    title,
    description,
    image,
    logo,
    cover,
    url: `${SITE_URL}/vendor/${slug || id}`,
  };
}

function isVendorActive(raw) {
  if (!raw || typeof raw !== "object") return false;
  if (raw.active === true) return true;
  if (raw.isActive === true) return true;
  if (typeof raw.status === "string") {
    return raw.status.toLowerCase() === "active";
  }
  if (raw.status && typeof raw.status === "object") {
    if (raw.status.active === true) return true;
    if (typeof raw.status.value === "string") {
      return raw.status.value.toLowerCase() === "active";
    }
  }
  return false;
}

export function buildVendorMetadata(vendor, vendorId, options = {}) {
  const isNotFound = options.notFound === true;
  const errorCode = options.errorCode || "";
  const publicId = vendor?.slug || vendorId || vendor?.id || "";
  const url = `${SITE_URL}/vendor/${publicId}`;
  const title =
    errorCode === "vendor_inactive"
      ? "Boutique temporairement indisponible — Monmarché"
      : isNotFound
        ? "Boutique introuvable — Monmarché"
        : vendor?.title || "Boutique Monmarché";
  const description = truncateMetaDescription(
    vendor?.description,
    errorCode === "vendor_inactive"
      ? "Cette boutique n'est pas active pour le moment sur Monmarché."
      : isNotFound
        ? "La boutique demandée est introuvable sur Monmarché."
        : "Découvrez cette boutique sur Monmarché et parcourez ses produits disponibles."
  );
  const image = vendor?.logo || vendor?.cover || vendor?.image || FALLBACK_IMAGE;

  return buildSocialMetadata({
    title,
    description,
    url,
    image,
    ogType: "website",
  });
}
