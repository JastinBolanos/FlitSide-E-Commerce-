import React, { useState } from 'react';
import { ShoppingBag, SlidersHorizontal, Store, Shield, Search, Menu, X } from 'lucide-react';
import { ProductCategory } from '../types';
import { FlitsideLogo } from './FlitsideLogo';

interface NavbarProps {
  currentView: 'store' | 'admin';
  onViewChange: (view: 'store' | 'admin') => void;
  cartItemCount: number;
  onOpenCart: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pendingOrdersCount: number;
  onOpenWelcome?: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Camisetas', value: 'Camisetas' },
  { label: 'Pantalones', value: 'Pantalones' },
  { label: 'Chaquetas', value: 'Chaquetas' },
  { label: 'Calzado', value: 'Calzado' },
  { label: 'Accesorios', value: 'Accesorios' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  cartItemCount,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  pendingOrdersCount,
  onOpenWelcome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      {/* Top Banner: minimalist notice */}
      <div className="bg-slate-950 text-slate-200 text-xs py-1.5 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2">
        <span>ENVÍO GRATIS EN PEDIDOS SUPERIORES A 80€</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400">CÓDIGO: <strong className="text-white">FLITSIDE10</strong> (-10%)</span>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-md"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              id="brand-logo-btn"
              onClick={() => {
                onViewChange('store');
                onSelectCategory('all');
              }}
              className="text-left cursor-pointer flex items-center py-1 group"
              aria-label="FlitSide Inicio"
            >
              <FlitsideLogo className="h-6 sm:h-7 w-auto text-[#2E2C3D] hover:opacity-90 transition-opacity" />
            </button>

            {/* Admin indicator if and only if in admin mode */}
            {currentView === 'admin' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Panel de Administración
              </span>
            )}
          </div>

          {/* Center Search Input (Store view only, Desktop) */}
          {currentView === 'store' && (
            <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="navbar-search-desktop"
                  type="text"
                  placeholder="Buscar prendas, camisas, pantalones..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Optional Inicio / Bienvenida link */}
            {onOpenWelcome && currentView === 'store' && (
              <button
                id="btn-open-welcome"
                onClick={onOpenWelcome}
                className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Ir a Inicio"
              >
                Inicio
              </button>
            )}

            {/* If in admin view, button to return to store */}
            {currentView === 'admin' ? (
              <button
                id="btn-return-to-store"
                onClick={() => onViewChange('store')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Volver a la Tienda</span>
              </button>
            ) : (
              <>
                {/* Search toggle for mobile/tablet */}
                <button
                  id="btn-toggle-search-mobile"
                  onClick={() => setShowSearchInput(!showSearchInput)}
                  className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                  aria-label="Buscar productos"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Cart Button */}
                <button
                  id="btn-open-cart"
                  onClick={onOpenCart}
                  className="relative px-3 sm:px-4 py-2 bg-slate-100 rounded-full flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition-colors text-slate-800"
                  aria-label={`Carrito de compras, ${cartItemCount} artículos`}
                >
                  <ShoppingBag className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline text-xs font-semibold">Carrito</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold shadow-xs">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Collapsible Mobile Search */}
        {currentView === 'store' && showSearchInput && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="navbar-search-mobile"
                type="text"
                placeholder="Buscar prenda, color o talla..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Navigation Bar (Store View Only) */}
        {currentView === 'store' && (
          <nav className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100 text-xs">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  id={`cat-filter-${cat.value}`}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          {currentView === 'admin' ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Administración</span>
              <button
                id="mobile-nav-return-store"
                onClick={() => {
                  onViewChange('store');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white"
              >
                <Store className="w-4 h-4" />
                <span>Volver a la Tienda</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">Colecciones</span>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={`mobile-cat-${cat.value}`}
                    onClick={() => {
                      onSelectCategory(cat.value);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
              {onOpenWelcome && (
                <button
                  id="mobile-nav-welcome-btn"
                  onClick={() => {
                    onOpenWelcome();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border-t border-slate-100 mt-1 pt-2"
                >
                  <span>Inicio</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
