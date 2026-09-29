import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/catalog";

export default function ProductGrid({ products }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => (
        <li key={product.url}>
          <Link
            href={`/p/${product.slug || product.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-orange-50">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary">
                {product.title}
              </h3>
              {product.vendorName ? (
                <p className="text-xs text-gray-500 truncate">{product.vendorName}</p>
              ) : null}
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                {product.price ? (
                  <p className="text-base font-extrabold text-primary">
                    {formatPrice(product.price, product.currency)}
                  </p>
                ) : (
                  <span />
                )}
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  Voir
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
