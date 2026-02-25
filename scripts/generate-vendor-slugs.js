const { getApps, initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const FIRESTORE_COLLECTION =
  process.env.FIRESTORE_VENDORS_COLLECTION || "vendors";

function slugify(input) {
  if (!input) return "";
  return input
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveVendorName(data) {
  if (!data) return "";
  const company = data.company || {};
  const profile = data.profile || {};
  const shop = data.shop || data.store || {};
  return (
    company.name ||
    data.title ||
    data.name ||
    data.displayName ||
    data.businessName ||
    shop.name ||
    profile.name ||
    ""
  );
}

function getDb() {
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

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const db = getDb();
  const snapshot = await db.collection(FIRESTORE_COLLECTION).get();
  const used = new Set();
  const updates = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const existingSlug = data.slug ? String(data.slug) : "";
    const baseSlug =
      existingSlug || slugify(resolveVendorName(data)) || `vendeur-${doc.id}`;

    let slug = baseSlug;
    let counter = 2;
    while (used.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
    used.add(slug);

    if (existingSlug !== slug) {
      updates.push({ ref: doc.ref, slug });
    }
  });

  if (updates.length === 0) {
    console.log("Aucun slug vendeur à mettre à jour.");
    return;
  }

  console.log(
    `${updates.length} slugs vendeurs à mettre à jour${dryRun ? " (dry-run)" : ""}.`
  );

  if (dryRun) {
    updates.slice(0, 20).forEach((item) => {
      console.log(`- ${item.ref.id} -> ${item.slug}`);
    });
    if (updates.length > 20) {
      console.log(`... +${updates.length - 20} autres`);
    }
    return;
  }

  const batchSize = 450;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = db.batch();
    const chunk = updates.slice(i, i + batchSize);
    chunk.forEach((item) => {
      batch.update(item.ref, { slug: item.slug });
    });
    await batch.commit();
    console.log(`Batch ${i / batchSize + 1} applique (${chunk.length} docs).`);
  }
}

main().catch((err) => {
  console.error("Erreur generation slugs vendeurs:", err);
  process.exit(1);
});
