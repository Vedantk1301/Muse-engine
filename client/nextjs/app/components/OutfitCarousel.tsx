import React from "react";
/* eslint-disable @next/next/no-img-element */
import type { Outfit, Product } from "@/app/api";

type Props = {
  outfits: Outfit[];
  products: Product[];
};

const OutfitCarousel: React.FC<Props> = ({ outfits, products }) => {
  const index: Record<string, Product> = Object.fromEntries(products.map((p) => [p.id, p]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {outfits.map((outfit) => {
        const items = outfit.items.map((id) => index[id]).filter(Boolean);
        return (
          <div key={outfit.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
                  {outfit.name}
                </h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{outfit.description}</p>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center p-2 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:bg-slate-900 transition-colors group">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-800 group-hover:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-200 truncate group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                      {item.brand || "Brand"}
                    </p>
                    {item.validator_tag && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20">
                        {item.validator_tag}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OutfitCarousel;
