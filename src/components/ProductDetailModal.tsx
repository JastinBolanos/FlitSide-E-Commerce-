import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: ProductSize, color: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '#0f172a');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || '#0f172a');
      setQuantity(1);
    }
  }, [product]);

  const isOutOfStock = product.stock <= 0;
  const maxAvailable = Math.min(product.stock, 10);

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close button */}
        <button
          id="btn-close-product-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-900 bg-white/80 backdrop-blur-xs rounded-full transition-colors cursor-pointer"
          aria-label="Cerrar vista de producto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[280px] md:min-h-full">
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
            className="w-full h-full object-cover object-center"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              ¡Solo quedan {product.stock} unidades!
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                {product.category}
              </p>
              <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
              <div className="mt-2 flex items-baseline gap-2.5">
                <span className="text-2xl font-bold text-blue-600">
                  {product.price.toFixed(2)}€
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              {product.description}
            </p>

            {product.material && (
              <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <strong className="text-slate-700 font-medium">Composición:</strong> {product.material}
              </div>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-2">
                <span>Seleccionar Talla</span>
                <span className="text-slate-400 font-normal">Talla seleccionada: {selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    id={`modal-size-${size}`}
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 min-w-9 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <span className="block text-xs font-medium text-slate-700 mb-2">Color</span>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    id={`modal-color-${idx}`}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center border ${
                      selectedColor === color ? 'ring-2 ring-blue-600 ring-offset-2 scale-110' : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Seleccionar color ${color}`}
                  >
                    {selectedColor === color && (
                      <Check className={`w-3.5 h-3.5 ${color === '#f8fafc' ? 'text-slate-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div>
                <span className="block text-xs font-medium text-slate-700 mb-2">Cantidad</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      id="btn-qty-minus"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 text-sm font-semibold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-semibold text-slate-800 bg-white min-w-9 text-center">
                      {quantity}
                    </span>
                    <button
                      id="btn-qty-plus"
                      onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                      disabled={quantity >= maxAvailable}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 text-sm font-semibold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Disponibles: {product.stock}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action & Assurances */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <button
              id="btn-modal-add-to-cart"
              disabled={isOutOfStock}
              onClick={handleAdd}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : addedAnimation
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 active:scale-[0.99]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Añadido al Carrito!</span>
                </>
              ) : isOutOfStock ? (
                <span>Prenda Agotada</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir al Carrito • {(product.price * quantity).toFixed(2)}€</span>
                </>
              )}
            </button>

            {/* Quick badges */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-slate-500 text-center font-medium">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Envío 24/48h</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Devolución 30d</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Pago Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
