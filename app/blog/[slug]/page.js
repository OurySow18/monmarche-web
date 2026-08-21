// app/blog/[slug]/page.js

import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function extractMetadata(content) {
  const match = content.match(/export const metadata\s*=\s*({[\s\S]*?});/);
  if (!match) return {};
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${match[1]});`)();
  } catch {
    return {};
  }
}

function getPost(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data = extractMetadata(fileContent);
  return { content: fileContent, data };
}

export async function generateStaticParams() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({
      slug: file.replace(/\.mdx?$/, ''),
    }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPost(slug);
  if (!post) return {};

  const { data } = post;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monmarchegn.com';
  const url = `${baseUrl}/blog/${slug}`;
  const image = data.cover || `${baseUrl}/images/og-monmarche.png`;

  return {
    title: data.title || 'Article de blog',
    description: data.excerpt || '',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: data.title || 'Article de blog',
      description: data.excerpt || '',
      url,
      type: 'article',
      publishedTime: data.date || undefined,
      images: [
        {
          url: image,
          alt: data.title || 'Monmarché',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title || 'Article de blog',
      description: data.excerpt || '',
      images: [image],
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = params;
  const post = getPost(slug);

  if (!post) return notFound();

  const { content, data } = post;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monmarchegn.com';
  const articleUrl = `${baseUrl}/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.excerpt,
    image: [data.cover || `${baseUrl}/images/og-monmarche.png`],
    datePublished: data.date,
    author: { '@type': 'Organization', name: 'Monmarché' },
    publisher: {
      '@type': 'Organization',
      name: 'Monmarché',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary leading-tight drop-shadow-sm">
          {data.title}
        </h1>
        {data.date && (
          <p className="text-gray-500 mt-2 text-sm italic">Publié le {new Date(data.date).toLocaleDateString('fr-FR')}</p>
        )}

        {data.cover && (
          <div className="mt-6">
            <Image
              src={data.cover}
              alt={data.title || 'Monmarché'}
              width={800}
              height={400}
              className="rounded-xl shadow-md mx-auto"
            />
          </div>
        )}
      </header>

      <div className="prose prose-lg prose-orange max-w-none text-gray-800">
        <MDXRemote source={content} />
      </div>

      {data.video && (
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-md">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={data.video}
              title={data.title ? `Vidéo : ${data.title}` : "Vidéo Monmarché"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="mt-16 rounded-3xl bg-primary px-6 py-10 text-center text-white sm:px-10">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Envie de passer commande ?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">
          Téléchargez Monmarché et recevez vos courses à domicile à Conakry,
          en quelques clics.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="https://play.google.com/store/apps/details?id=com.amasow.Monmarche&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto">
              Télécharger sur Android
            </Button>
          </a>
          <a
            href="https://apps.apple.com/de/app/monmarche/id6479302215"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="w-full border-white text-white hover:bg-white/10 sm:w-auto"
            >
              Télécharger sur iPhone
            </Button>
          </a>
        </div>
      </div>

      <footer className="mt-10 pt-8 border-t text-center text-sm text-gray-600">
        <p className="mb-3">Merci d’avoir lu cet article 🙏</p>
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-primary font-medium">
          <a href={`https://wa.me/004929258777?text=Découvrez cet article : ${articleUrl}`} target="_blank" className="hover:underline">Partager sur WhatsApp</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`} target="_blank" className="hover:underline">Partager sur Facebook</a>
        </div>
        <a href="/blog" className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">← Retour au blog</a>
      </footer>
    </article>
  );
}
