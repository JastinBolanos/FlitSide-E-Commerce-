import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  useEffect(() => {
    if (order) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0f172a', '#334155', '#94a3b8', '#10b981', '#f59e0b'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            ORDER CONFIRMED
          </span>
          <h2 className="text-xl font-medium text-slate-900 mt-1">Thank you for your order!</h2>
          <p className="text-xs text-slate-500 mt-1">
            We have received your order and are currently preparing it at our atelier.
          </p>

          {/* Order Details Card */}
          <div className="my-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Order reference:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {order.orderNumber}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Recipient:</span>
              <span className="font-medium text-slate-800">{order.customer.fullName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Delivery to:</span>
              <span className="text-slate-800 truncate max-w-[200px]">
                {order.customer.address}, {order.customer.city}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total paid:</span>
              <span className="font-semibold text-slate-900">{order.total.toFixed(2)}€</span>
            </div>

            {/* Purchased Items Preview */}
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Garments ({order.items.length})
              </span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                  <span>
                    {item.quantity}x {item.name} ({item.selectedSize})
                  </span>
                  <span className="font-mono">{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              id="btn-confirm-continue"
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
