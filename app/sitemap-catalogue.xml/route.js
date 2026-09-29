import { CATEGORIES, listPublicProducts, listPublicVendors } from "@/lib/catalog";
import { SITE_URL } from "@/app/p/product-service";

// Les pages statiques sont dans /sitemap.xml (next-sitemap, généré au build).
// Ce sitemap-ci liste le catalogue, qui change sans redéploiement.
export const revalidate = 3600;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
}

function entry(loc, lastmod, priority) {
  return [
    "<url>",
    `<loc>${escapeXml(loc)}</loc>`,
    lastmod ? `<lastmod>${lastmod}</lastmod>` : "",
    `<priority>${priority}</priority>`,
    "</url>",
  ].join("");
}

export async function GET() {
  const [products, vendors] = await Promise.all([
    listPublicProducts(),
    listPublicVendors(),
  ]);

  const urls = [
    entry(`${SITE_URL}/categorie`, null, "0.8"),
    ...CATEGORIES.map((category) =>
      entry(`${SITE_URL}/categorie/${category.slug}`, null, "0.8")
    ),
    ...products.map((product) =>
      entry(product.url, toDate(product.updatedAt), "0.6")
    ),
    ...vendors.map((vendor) =>
      entry(`${SITE_URL}/vendor/${vendor.slug}`, toDate(vendor.updatedAt), "0.5")
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
