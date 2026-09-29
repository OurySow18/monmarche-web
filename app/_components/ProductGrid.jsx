import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/catalog";

export default function ProductGrid({ products }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <li key={product.url}>
          <Link
            href={`/p/${product.slug || product.id}`}
            className="group block h-full rounded-2xl border border-orange-100 bg-white overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square bg-orange-50">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-3 space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary">
                {product.title}
              </h3>
              {product.price ? (
                <p className="text-sm font-bold text-primary">
                  {formatPrice(product.price, product.currency)}
                </p>
              ) : null}
              {product.vendorName ? (
                <p className="text-xs text-gray-500 truncate">{product.vendorName}</p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
