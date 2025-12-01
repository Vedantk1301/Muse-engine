import React from "react";
/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/app/api";

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  const price = product.price?.value ? `${product.price.currency ?? ""}${product.price.value}` : null;

  return (
    <a
      href={product.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Validator Badge */}
        {product.validator_tag && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-sky-300 shadow-lg">
            {product.validator_tag}
            {product.validator_score && <span className="ml-1 opacity-70">· {product.validator_score}</span>}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <p className="text-xs font-bold text-sky-400 uppercase tracking-widest truncate">
            {product.brand || "Unknown Brand"}
          </p>
          {price && (
            <p className="text-sm font-bold text-amber-400 shrink-0">
              {price}
            </p>
          )}
        </div>

        <h3 className="text-sm font-medium text-slate-200 line-clamp-2 leading-relaxed group-hover:text-sky-200 transition-colors">
          {product.title}
        </h3>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-800/50 text-[10px] font-medium text-slate-400 border border-slate-700/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
};

export default ProductCard;
