// app/blog/[slug]/page.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function getPost(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(fileContent);
  return { content, data };
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
      images: data.cover
        ? [
            {
              url: data.cover,
              alt: data.title || 'Image de couverture',
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title || 'Article de blog',
      description: data.excerpt || '',
      images: data.cover ? [data.cover] : undefined,
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

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ff6f00] leading-tight drop-shadow-sm">
          {data.title}
        </h1>
        {data.date && (
          <p className="text-gray-500 mt-2 text-sm italic">Publié le {new Date(data.date).toLocaleDateString('fr-FR')}</p>
        )}

        {data.cover && (
          <div className="mt-6">
            <Image
              src={data.cover}
              alt="Image de couverture"
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

      <footer className="mt-16 pt-8 border-t text-center text-sm text-gray-600">
        <p className="mb-3">Merci d’avoir lu cet article 🙏</p>
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-[#ff6f00] font-medium">
          <a href={`https://wa.me/004929258777?text=Découvrez cet article : ${articleUrl}`} target="_blank" className="hover:underline">Partager sur WhatsApp</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`} target="_blank" className="hover:underline">Partager sur Facebook</a>
        </div>
        <a href="/blog" className="inline-block mt-2 px-4 py-2 bg-[#ff6f00] text-white rounded-md hover:bg-orange-600 transition">← Retour au blog</a>
      </footer>
    </article>
  );
}
