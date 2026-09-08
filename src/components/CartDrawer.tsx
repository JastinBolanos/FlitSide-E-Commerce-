import React, { useState, useMemo } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { CartItem, AppliedPromo } from '../domain/models';
import { CartDomainService } from '../domain/services/cartDomainService';
import { BUSINESS_RULES } from '../core/constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (appliedDiscount: number, promoCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>({
    code: BUSINESS_RULES.DEFAULT_PROMO_CODE,
    percent: BUSINESS_RULES.DEFAULT_PROMO_DISCOUNT_PERCENT,
  });
  const [promoError, setPromoError] = useState('');

  // Domain Calculations via CartDomainService
  const totals = useMemo(() => {
    return CartDomainService.calculateTotals(cartItems, appliedPromo?.percent || 0);
  }, [cartItems, appliedPromo]);

  const {
    subtotal,
    discountAmount,
    shippingCost,
    total,
    isFreeShipping,
    remainingForFreeShipping,
    progressPercent,
  } = totals;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const validation = CartDomainService.validatePromoCode(promoInput);
    if (validation.isValid) {
      setAppliedPromo({ code: validation.normalizedCode, percent: validation.percent });
      setPromoInput('');
    } else {
      setPromoError(`Invalid promo code. Try "${BUSINESS_RULES.DEFAULT_PROMO_CODE}"`);
    }
  };

  const handleCheckoutClick = () => {
    onProceedToCheckout(discountAmount, appliedPromo?.code || '');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-semibold text-slate-900 tracking-wide uppercase">
                Shopping Bag
              </h2>
              <span className="text-xs text-slate-500 font-normal">
                ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
            <button
              id="btn-close-cart"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
              aria-label="Close shopping bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Notification Bar */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/70">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-slate-700" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-semibold">Free shipping unlocked!</span>
                ) : (
                  <span className="text-slate-700">
                    Add <strong>{remainingForFreeShipping.toFixed(2)}€</strong> more for free shipping
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isFreeShipping ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Explore our contemporary catalog and discover garments with timeless cuts and natural fabrics.
                </p>
                <button
                  id="btn-explore-collection"
                  onClick={onClose}
                  className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200/60">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('/images/prod-1.jpg')) {
                          target.src = '/images/prod-1.jpg';
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-medium text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          id={`btn-remove-item-${index}`}
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {item.selectedSize}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          id={`btn-cart-qty-minus-${index}`}
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-medium text-slate-800 bg-white">
                          {item.quantity}
                        </span>
                        <button
                          id={`btn-cart-qty-plus-${index}`}
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 text-xs font-semibold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-slate-900">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50/70 space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="promo-code-input"
                    type="text"
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 uppercase tracking-wider"
                  />
                </div>
                <button
                  id="btn-apply-promo"
                  type="submit"
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Discount <strong>{appliedPromo.code}</strong> (-{appliedPromo.percent}%)</span>
                  </div>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-emerald-700 hover:text-emerald-900 text-[11px] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount applied</span>
                    <span>-{discountAmount.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `${shippingCost.toFixed(2)}€`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-blue-600 text-lg">{total.toFixed(2)}€</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="btn-cart-checkout"
                onClick={handleCheckoutClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold mt-4 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout • {total.toFixed(2)}€</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
