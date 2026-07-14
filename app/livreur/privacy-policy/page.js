import { Fragment } from "react";
import { readFile } from "fs/promises";
import path from "path";

const PAGE_URL = "https://monmarchegn.com/livreur/privacy-policy";
const PAGE_TITLE = "Politique de confidentialite — Monmarche Livreur";
const PAGE_DESCRIPTION =
  "Politique de confidentialite de l'application Monmarche Livreur pour les stores et les utilisateurs.";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "article",
    url: PAGE_URL,
    images: [
      {
        url: "https://monmarchegn.com/images/og-monmarche.png",
        width: 1200,
        height: 630,
        alt: "Monmarche Livreur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["https://monmarchegn.com/images/og-monmarche.png"],
  },
};

async function loadPrivacyPolicyBlocks() {
  const filePath = path.join(process.cwd(), "PRIVACY_POLICY.md");
  const raw = await readFile(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const blocks = [];
  let paragraphLines = [];

  function flushParagraph() {
    if (!paragraphLines.length) return;
    blocks.push({
      type: "paragraph",
      lines: paragraphLines,
    });
    paragraphLines = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      blocks.push({ type: "h1", text: trimmed.slice(2).trim() });
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      continue;
    }

    paragraphLines.push(trimmed);
  }

  flushParagraph();
  return blocks;
}

function renderParagraphLines(lines) {
  return lines.map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export default async function MonmarcheLivreurPrivacyPolicyPage() {
  const blocks = await loadPrivacyPolicyBlocks();

  return (
    <section className="bg-gradient-to-b from-orange-50 via-white to-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-orange-100 bg-white shadow-sm">
          <div className="border-b border-orange-100 px-6 py-8 sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#ff6f00]">
              Monmarche Livreur
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Politique de confidentialite
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Cette page publique peut etre utilisee comme URL de politique de
              confidentialite pour les stores de l&apos;application Monmarche
              Livreur.
            </p>
          </div>

          <div className="space-y-6 px-6 py-8 text-gray-800 sm:px-10">
            {blocks.map((block, index) => {
              if (block.type === "h1") {
                return null;
              }

              if (block.type === "h2") {
                return (
                  <h2
                    key={`${block.text}-${index}`}
                    className="pt-2 text-2xl font-semibold text-gray-900"
                  >
                    {block.text}
                  </h2>
                );
              }

              return (
                <p
                  key={`${block.lines.join("-")}-${index}`}
                  className="leading-7 text-gray-700"
                >
                  {renderParagraphLines(block.lines)}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
