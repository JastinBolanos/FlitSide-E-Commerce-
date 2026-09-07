import React from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickAdd: (product: Product, size: ProductSize, color: string) => void;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickAdd,
  onOpenDetail,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const defaultSize = product.sizes[0] || 'M';
  const defaultColor = product.colors[0] || '#0f172a';

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('/images/prod-1.jpg')) {
              target.src = '/images/prod-1.jpg';
            }
          }}
          className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {discountPercent && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-600 text-white rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {isOutOfStock ? (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-white rounded-md shadow-xs">
              Agotado
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-amber-500 text-white rounded-md shadow-xs">
              Últimas {product.stock} u.
            </span>
          ) : null}
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            id={`btn-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-lg text-xs font-semibold tracking-wider uppercase shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all border border-slate-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Detalle</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              {product.category}
            </p>
            {/* Color swatches preview */}
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: col }}
                  title={`Color ${col}`}
                />
              ))}
            </div>
          </div>

          <h3
            onClick={() => onOpenDetail(product)}
            className="font-semibold text-slate-800 text-sm line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-blue-600 font-bold text-base">
              {product.price.toFixed(2)}€
            </p>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {product.originalPrice.toFixed(2)}€
              </span>
            )}
          </div>
        </div>

        {/* Sizes preview & Add action */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
            {product.sizes.slice(0, 4).map((size) => (
              <span key={size} className="px-1.5 py-0.5 bg-slate-50 rounded text-slate-600 border border-slate-200 text-[10px]">
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-slate-400 text-[10px]">+{product.sizes.length - 4}</span>
            )}
          </div>

          <button
            id={`btn-quick-add-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => onQuickAdd(product, defaultSize, defaultColor)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-blue-600 text-white shadow-xs'
            }`}
            title={isOutOfStock ? 'Sin existencias' : 'Añadir al carrito'}
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
