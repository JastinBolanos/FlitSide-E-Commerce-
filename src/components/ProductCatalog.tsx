import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, Check, Sparkles, RefreshCw } from 'lucide-react';
import { Product, ProductSize } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  onQuickAdd: (product: Product, size: ProductSize, color: string) => void;
  onOpenDetail: (product: Product) => void;
  onResetFilters: () => void;
}

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL'];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  searchQuery,
  onQuickAdd,
  onOpenDetail,
  onResetFilters,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchCat = product.category.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          if (!matchName && !matchCat && !matchDesc) return false;
        }

        // Size filter
        if (selectedSize !== 'all' && !product.sizes.includes(selectedSize as ProductSize)) {
          return false;
        }

        // In-stock only filter
        if (inStockOnly && product.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        // Default: featured first, then stock
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, selectedSize, inStockOnly, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedSize !== 'all' ||
    inStockOnly;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Visual Header / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            {selectedCategory === 'all' ? 'Colección FlitSide' : selectedCategory}
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            {selectedCategory === 'all' ? 'Catálogo FlitSide' : `Colección ${selectedCategory}`}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium mr-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </span>

          {/* Toggle Mobile Filter Button */}
          <button
            id="btn-toggle-filters-mobile"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className={`mt-4 pt-2 pb-4 ${showFiltersMobile ? 'block' : 'hidden sm:block'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
          {/* Sizes chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">Talla:</span>
            <button
              id="filter-size-all"
              onClick={() => setSelectedSize('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedSize === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              Todas
            </button>
            {SIZES.map((size) => (
              <button
                key={size}
                id={`filter-size-${size}`}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSize === size
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Right side: Stock checkbox + Sort */}
          <div className="flex items-center gap-4 flex-wrap ml-auto">
            {/* In stock only toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none font-medium">
              <input
                id="filter-in-stock-only"
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Solo disponibles</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-sm cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre: A - Z</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                id="btn-reset-filters"
                onClick={() => {
                  setSelectedSize('all');
                  setInStockOnly(false);
                  setSortBy('featured');
                  onResetFilters();
                }}
                className="text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={onQuickAdd}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-medium text-slate-900">No se encontraron prendas</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            No hay productos que coincidan con los criterios seleccionados. Prueba a cambiar los filtros o el término de búsqueda.
          </p>
          <button
            id="btn-clear-empty-filters"
            onClick={() => {
              setSelectedSize('all');
              setInStockOnly(false);
              setSortBy('featured');
              onResetFilters();
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Ver todo el catálogo
          </button>
        </div>
      )}
    </section>
  );
};
