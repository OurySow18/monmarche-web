// app/blog/[slug]/page.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'blog');
  const files = fs.readdirSync(dir);
  return files.map(file => ({
    slug: file.replace(/\.mdx?$/, '')
  }));
}

export default async function BlogArticlePage({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return notFound();

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(fileContent);

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
              title="Vidéo Monmarché"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <footer className="mt-16 pt-8 border-t text-center text-sm text-gray-600">
        <p className="mb-3">Merci d’avoir lu cet article 🙏</p>
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-[#ff6f00] font-medium">
          <a href={`https://wa.me/004929258777?text=Découvrez cet article : https://monmarchegn.com/blog/${slug}`} target="_blank" className="hover:underline">Partager sur WhatsApp</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=https://monmarchegn.com/blog/${slug}`} target="_blank" className="hover:underline">Partager sur Facebook</a>
        </div>
        <a href="/blog" className="inline-block mt-2 px-4 py-2 bg-[#ff6f00] text-white rounded-md hover:bg-orange-600 transition">← Retour au blog</a>
      </footer>
    </article>
  );
}
