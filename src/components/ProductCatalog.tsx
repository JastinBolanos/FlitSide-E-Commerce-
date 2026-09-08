import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, Check, Sparkles, RefreshCw, Ruler, X } from 'lucide-react';
import { Product, ProductSize } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  onQuickAdd: (product: Product, size: ProductSize, color: string) => void;
  onOpenDetail: (product: Product) => void;
  onResetFilters: () => void;
  onlyNewArrivals?: boolean;
  onClearNewArrivals?: () => void;
  onOpenSizeGuide?: () => void;
}

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL'];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  searchQuery,
  onQuickAdd,
  onOpenDetail,
  onResetFilters,
  onlyNewArrivals = false,
  onClearNewArrivals,
  onOpenSizeGuide,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // New arrivals filter from footer or navigation
        if (onlyNewArrivals && !product.featured) {
          return false;
        }

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
  }, [products, selectedCategory, searchQuery, selectedSize, inStockOnly, sortBy, onlyNewArrivals]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedSize !== 'all' ||
    inStockOnly ||
    onlyNewArrivals;

  const handleResetAll = () => {
    setSelectedSize('all');
    setInStockOnly(false);
    setSortBy('featured');
    if (onClearNewArrivals) {
      onClearNewArrivals();
    }
    onResetFilters();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Visual Header / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          {onlyNewArrivals ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Collection 2026
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">FlitSide New Arrivals</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>New Arrivals 2026</span>
                <Sparkles className="w-5 h-5 text-blue-600" />
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Contemporary garments with refined tailoring and premium fabrics introduced for the current season.
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                {selectedCategory === 'all' ? 'FlitSide Collection' : selectedCategory}
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                {selectedCategory === 'all' ? 'FlitSide Catalog' : `${selectedCategory} Collection`}
              </h1>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium mr-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'garment' : 'garments'}
          </span>

          {/* Toggle Mobile Filter Button */}
          <button
            id="btn-toggle-filters-mobile"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* New Arrivals Active Notification Banner */}
      {onlyNewArrivals && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Filtered by <strong>New Arrivals 2026</strong>. Exploring seasonal releases in natural textiles.
            </span>
          </div>
          <button
            id="btn-banner-clear-new-arrivals"
            onClick={onClearNewArrivals}
            className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-950 underline self-start sm:self-auto cursor-pointer"
          >
            <span>View full catalog</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter & Sort Bar */}
      <div className={`mt-4 pt-2 pb-4 ${showFiltersMobile ? 'block' : 'hidden sm:block'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
          {/* Sizes chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">Size:</span>
            <button
              id="filter-size-all"
              onClick={() => setSelectedSize('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedSize === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              All
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

            {/* Quick Size Guide Trigger */}
            {onOpenSizeGuide && (
              <button
                id="btn-filter-open-size-guide"
                onClick={onOpenSizeGuide}
                className="ml-1 flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="View size & care guide"
              >
                <Ruler className="w-3.5 h-3.5 text-blue-600" />
                <span>Size Guide</span>
              </button>
            )}
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
              <span>In stock only</span>
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
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A - Z</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                id="btn-reset-filters"
                onClick={handleResetAll}
                className="text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
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
          <h3 className="text-base font-medium text-slate-900">No garments found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            No products match your selected criteria. Try adjusting the filters or search terms.
          </p>
          <button
            id="btn-clear-empty-filters"
            onClick={handleResetAll}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            View full catalog
          </button>
        </div>
      )}
    </section>
  );
};
