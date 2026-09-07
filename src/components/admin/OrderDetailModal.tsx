import React from 'react';
import { X, Package, Mail, Phone, MapPin, CreditCard, Clock, Calendar, CheckCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const STATUS_OPTIONS: { label: string; value: OrderStatus; color: string }[] = [
  { label: 'Pendiente', value: 'Pendiente', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { label: 'En preparación', value: 'En preparación', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { label: 'Enviado', value: 'Enviado', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { label: 'Entregado', value: 'Entregado', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { label: 'Cancelado', value: 'Cancelado', color: 'bg-rose-100 text-rose-800 border-rose-300' },
];

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  if (!order) return null;

  const currentStatusObj = STATUS_OPTIONS.find((s) => s.value === order.status) || STATUS_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Pedido {order.orderNumber}
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Registrado el {new Date(order.createdAt).toLocaleString('es-ES')}
              </span>
            </div>
          </div>
          <button
            id="btn-close-order-detail"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
            aria-label="Cerrar detalle de pedido"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Estado del pedido actual:</span>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold border ${currentStatusObj.color}`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="admin-change-status" className="text-xs text-slate-600 font-medium">
                Cambiar estado:
              </label>
              <select
                id="admin-change-status"
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Datos del Cliente
              </h3>
              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-900 text-sm">{order.customer.fullName}</p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${order.customer.email}`} className="hover:underline">
                    {order.customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{order.customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Dirección de Envío
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{order.customer.address}</p>
                    <p>{order.customer.city}, {order.customer.postalCode}</p>
                  </div>
                </div>
                {order.customer.notes && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                    Notas: "{order.customer.notes}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Prendas del Pedido ({order.items.length})
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover rounded-lg bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-medium text-slate-900">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          Talla: {item.selectedSize}
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                        <span>x{item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">
                      {(item.price * item.quantity).toFixed(2)}€
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {item.price.toFixed(2)}€ / u.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Totals Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Método de Pago:</span>
              <span className="font-medium text-slate-800 capitalize">
                {order.paymentMethod === 'credit_card'
                  ? 'Tarjeta Bancaria'
                  : order.paymentMethod === 'transfer'
                  ? 'Transferencia Bancaria'
                  : 'Pago Contra Entrega'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{order.subtotal.toFixed(2)}€</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Descuento aplicado:</span>
                <span>-{order.discount.toFixed(2)}€</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Costes de Envío:</span>
              <span>{order.shipping === 0 ? 'Gratuito' : `${order.shipping.toFixed(2)}€`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total del Pedido:</span>
              <span>{order.total.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
