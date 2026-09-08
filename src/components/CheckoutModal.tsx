import React, { useState, useMemo } from 'react';
import { X, ShieldCheck, CreditCard, Landmark, Truck, Check, Lock } from 'lucide-react';
import { CartItem, CustomerInfo, Order, PaymentMethod } from '../domain/models';
import { CartDomainService } from '../domain/services/cartDomainService';
import { OrderDomainService } from '../domain/services/orderDomainService';
import { dataService } from '../services/dataService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  promoCode: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  promoCode,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Cart calculations using Domain Service
  const cartTotals = useMemo(() => {
    return CartDomainService.calculateTotals(cartItems);
  }, [cartItems]);

  const subtotal = cartTotals.subtotal;
  const shipping = cartTotals.shippingCost;
  const total = Math.max(0, Number((subtotal - discountAmount + shipping).toFixed(2)));

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const validation = OrderDomainService.validateCustomer(customer);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    setTimeout(() => {
      // Map cartItems to OrderItems via Domain Service
      const orderItems = OrderDomainService.mapCartItemsToOrderItems(cartItems);

      const newOrder = dataService.createOrder({
        customer,
        items: orderItems,
        subtotal,
        discount: discountAmount,
        shipping,
        total,
        paymentMethod,
        status: 'Pending',
      });

      setIsProcessing(false);
      onOrderSuccess(newOrder);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900 tracking-wide uppercase">
              Checkout
            </h2>
          </div>
          <button
            id="btn-close-checkout"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Customer Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Delivery Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  id="checkout-fullname"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={customer.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.fullName ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-slate-900'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder="alex@example.com"
                  value={customer.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.email ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-slate-900'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number *</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={customer.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.phone ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-slate-900'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
                <input
                  id="checkout-city"
                  type="text"
                  placeholder="London, New York, Paris..."
                  value={customer.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.city ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-slate-900'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Street Address *</label>
                <input
                  id="checkout-address"
                  type="text"
                  placeholder="123 Main Street, Apt 4B"
                  value={customer.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.address ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-slate-900'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Postal / ZIP Code *</label>
                <input
                  id="checkout-postalcode"
                  type="text"
                  placeholder="10001"
                  value={customer.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.postalCode ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-slate-900'
                  }`}
                />
                {errors.postalCode && <p className="text-[11px] text-rose-500 mt-1">{errors.postalCode}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Notes (optional)</label>
                <input
                  id="checkout-notes"
                  type="text"
                  placeholder="Leave with concierge or ring doorbell"
                  value={customer.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                id="payment-card"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'credit_card'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-2" />
                <div>
                  <span className="text-xs font-semibold block">Credit / Debit Card</span>
                  <span className={`text-[10px] ${paymentMethod === 'credit_card' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Visa, Mastercard
                  </span>
                </div>
              </button>

              <button
                type="button"
                id="payment-transfer"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'transfer'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Landmark className="w-4 h-4 mb-2" />
                <div>
                  <span className="text-xs font-semibold block">Bank Transfer</span>
                  <span className={`text-[10px] ${paymentMethod === 'transfer' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Direct wire
                  </span>
                </div>
              </button>

              <button
                type="button"
                id="payment-cod"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Truck className="w-4 h-4 mb-2" />
                <div>
                  <span className="text-xs font-semibold block">Cash on Delivery</span>
                  <span className={`text-[10px] ${paymentMethod === 'cash_on_delivery' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Pay on arrival
                  </span>
                </div>
              </button>
            </div>

            {/* Sub-card details */}
            {paymentMethod === 'credit_card' && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-2 text-xs">
                <div className="col-span-3">
                  <label className="block text-[11px] text-slate-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] text-slate-500 mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'transfer' && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Official bank account details:</p>
                <p className="font-mono mt-1 text-[11px]">IBAN: ES91 2100 0418 4502 0005 1324</p>
                <p className="text-[11px] text-slate-500 mt-1">Please specify your customer name and order number as the payment reference.</p>
              </div>
            )}

            {paymentMethod === 'cash_on_delivery' && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <p className="text-[11px]">Pay conveniently with card or cash directly to the courier upon delivery.</p>
              </div>
            )}
          </div>

          {/* Section 3: Order Summary & Submit */}
          <div className="pt-4 border-t border-slate-200 bg-slate-50/50 p-4 rounded-xl">
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-700 font-medium mb-1">
                <span>Discount ({promoCode})</span>
                <span>-{discountAmount.toFixed(2)}€</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `${shipping.toFixed(2)}€`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total amount</span>
              <span className="text-blue-600 text-lg">{total.toFixed(2)}€</span>
            </div>

            <button
              id="btn-submit-order"
              type="submit"
              disabled={isProcessing}
              className="mt-4 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isProcessing ? (
                <span>Processing order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order • {total.toFixed(2)}€</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Encrypted 256-bit checkout. Your payment details are protected with bank-grade security.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
