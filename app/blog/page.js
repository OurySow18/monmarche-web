import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Notre Blog</h1>

      <p className="mb-4">
        Bienvenue sur le blog de Monmarché ! Ici, nous partageons des astuces pour mieux faire vos courses, découvrir nos nouveautés,
        en savoir plus sur les produits locaux, et suivre l&apos;évolution de notre service en Guinée.
      </p>

      <div className="mt-8 space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-semibold mb-2 text-[#ff6f00] hover:underline">{post.title}</h2>
            </Link>
            <p className="text-gray-600 text-sm mb-1 italic">Publié le {new Date(post.date).toLocaleDateString('fr-FR')}</p>
            <p className="text-gray-700">
              {post.excerpt} <Link href={`/blog/${post.slug}`} className="text-[#ff6f00] font-medium hover:underline">Lire plus...</Link>
            </p>
          </article>
        ))}
      </div>

      <p className="mt-12 text-sm text-gray-500">Dernière mise à jour : avril 2025</p>
    </div>
  );
}

function getAllPosts() {
  const dir = path.join(process.cwd(), 'content', 'blog');
  const files = fs.readdirSync(dir);
  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    return {
      ...data
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}
