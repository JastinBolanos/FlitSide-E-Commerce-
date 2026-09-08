import React, { useState, useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductCategory } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { OrderDetailModal } from './OrderDetailModal';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  initialSelectedOrderId?: string | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  initialSelectedOrderId,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

  // Inventory state
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // Orders state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (initialSelectedOrderId) {
      return orders.find(o => o.id === initialSelectedOrderId) || null;
    }
    return null;
  });

  // Switch to orders tab if initialSelectedOrderId is given
  React.useEffect(() => {
    if (initialSelectedOrderId) {
      setActiveTab('orders');
      const found = orders.find(o => o.id === initialSelectedOrderId);
      if (found) setSelectedOrder(found);
    }
  }, [initialSelectedOrderId, orders]);

  // Operational metrics (NO visitor tracking / daily visits)
  const totalStock = useMemo(() => products.reduce((acc, p) => acc + p.stock, 0), [products]);
  const lowStockCount = useMemo(() => products.filter((p) => p.stock > 0 && p.stock <= 5).length, [products]);
  const outOfStockCount = useMemo(() => products.filter((p) => p.stock === 0).length, [products]);
  const pendingOrdersCount = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status === 'Pending' ||
          o.status === 'In Preparation' ||
          o.status === 'Pendiente' ||
          o.status === 'En preparación'
      ).length,
    [orders]
  );
  const completedOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'Delivered' || o.status === 'Entregado').length,
    [orders]
  );

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCatFilter !== 'all' && p.category !== selectedCatFilter) return false;
      if (stockFilter === 'low' && (p.stock > 5 || p.stock === 0)) return false;
      if (stockFilter === 'out' && p.stock > 0) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, selectedCatFilter, stockFilter, productSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all') {
        const matchesFilter =
          o.status === orderStatusFilter ||
          (orderStatusFilter === 'Pending' && o.status === 'Pendiente') ||
          (orderStatusFilter === 'In Preparation' && o.status === 'En preparación') ||
          (orderStatusFilter === 'Shipped' && o.status === 'Enviado') ||
          (orderStatusFilter === 'Delivered' && o.status === 'Entregado') ||
          (orderStatusFilter === 'Cancelled' && o.status === 'Cancelado');
        if (!matchesFilter) return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchName = o.customer.fullName.toLowerCase().includes(q);
        const matchEmail = o.customer.email.toLowerCase().includes(q);
        const matchCity = o.customer.city.toLowerCase().includes(q);
        return matchNum || matchName || matchEmail || matchCity;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const handleStockQuickStep = (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    onUpdateProduct(productId, { stock: newStock });
  };

  const handleSaveProduct = (
    productData: Omit<Product, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      onUpdateProduct(editingId, productData);
    } else {
      onAddProduct(productData);
    }
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
      case 'Pendiente':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'In Preparation':
      case 'En preparación':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shipped':
      case 'Enviado':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered':
      case 'Entregado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
      case 'Cancelado':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>FlitSide Studio</span>
            <span>•</span>
            <span className="text-blue-600">Operations Control Center</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Inventory & Customer Orders
          </h1>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            id="btn-admin-add-product-top"
            onClick={() => {
              setEditingProduct(null);
              setIsProductFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-blue-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Garment</span>
          </button>
        </div>
      </div>

      {/* Operational Stats Grid (Inventory & Orders strictly) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Active Catalog</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{products.length}</p>
          <span className="text-[11px] text-slate-500 font-normal">garment styles</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Warehouse Units</span>
            <Package className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalStock}</p>
          <span className="text-[11px] text-slate-500 font-normal">
            {lowStockCount > 0 ? (
              <span className="text-amber-600 font-medium">⚠️ {lowStockCount} low stock</span>
            ) : (
              'Balanced stock'
            )}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Orders In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{pendingOrdersCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">pending or in preparation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Fulfilled Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{completedOrdersCount}</p>
          <span className="text-[11px] text-slate-500 font-normal">out of {orders.length} total orders</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-4 mt-8 mb-6">
        <div className="flex items-center gap-2">
          <button
            id="tab-admin-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Garment Inventory</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'inventory' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            id="tab-admin-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Management</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {orders.length}
            </span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: INVENTORY ================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-inventory-search"
                type="text"
                placeholder="Search by style name or garment..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Category selector */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-medium">Category:</span>
              <select
                id="admin-cat-filter"
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Pants">Pants</option>
                <option value="Jackets">Jackets</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
              </select>

              {/* Stock status filter */}
              <select
                id="admin-stock-filter"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="all">All Stock Levels</option>
                <option value="low">Low Stock (≤ 5 units)</option>
                <option value="out">Out of Stock (0 units)</option>
              </select>
            </div>
          </div>

          {/* Products Table (Desktop & Tablet) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Sizes</th>
                    <th className="py-3 px-4 text-center">Warehouse Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No garments found in inventory matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isLow = p.stock > 0 && p.stock <= 5;
                      const isOut = p.stock === 0;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Product Name & Image */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-12 rounded object-cover bg-slate-100 border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-medium text-slate-900 block line-clamp-1">{p.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[11px]">
                              {p.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-semibold text-slate-900 font-mono">
                            {p.price.toFixed(2)}€
                            {p.originalPrice && (
                              <span className="text-[10px] text-slate-400 line-through block font-normal">
                                {p.originalPrice.toFixed(2)}€
                              </span>
                            )}
                          </td>

                          {/* Sizes */}
                          <td className="py-3 px-4">
                            <div className="flex gap-1 flex-wrap font-mono text-[10px]">
                              {p.sizes.map((s) => (
                                <span key={s} className="px-1 py-0.5 bg-slate-100 rounded text-slate-600">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Stock adjustment controls */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                              <button
                                onClick={() => handleStockQuickStep(p.id, p.stock, -1)}
                                disabled={p.stock <= 0}
                                className="px-2 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer font-bold"
                                title="Decrease 1 unit"
                              >
                                -
                              </button>
                              <span
                                className={`px-2.5 py-1 font-semibold font-mono text-xs bg-white min-w-9 text-center ${
                                   isOut ? 'text-rose-600 bg-rose-50' : isLow ? 'text-amber-600 bg-amber-50' : 'text-slate-800'
                                }`}
                              >
                                {p.stock}
                              </span>
                              <button
                                onClick={() => handleStockQuickStep(p.id, p.stock, 1)}
                                className="px-2 py-1 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
                                title="Add 1 unit"
                              >
                                +
                              </button>
                            </div>
                            {isLow && (
                              <span className="block text-[9px] text-amber-600 font-semibold uppercase mt-0.5">
                                Low stock
                              </span>
                            )}
                            {isOut && (
                              <span className="block text-[9px] text-rose-600 font-semibold uppercase mt-0.5">
                                Out of stock
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                id={`btn-edit-prod-${p.id}`}
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsProductFormOpen(true);
                                }}
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Edit garment"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                id={`btn-delete-prod-${p.id}`}
                                onClick={() => {
                                  if (confirm(`Permanently remove "${p.name}" from catalog?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                title="Delete garment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ORDERS ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-orders-search"
                type="text"
                placeholder="Search by order #, customer, or city..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-500 font-medium mr-1">Status:</span>
              {[
                { label: 'All', value: 'all' },
                { label: 'Pending', value: 'Pending' },
                { label: 'In Preparation', value: 'In Preparation' },
                { label: 'Shipped', value: 'Shipped' },
                { label: 'Delivered', value: 'Delivered' },
                { label: 'Cancelled', value: 'Cancelled' },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  id={`filter-order-${value}`}
                  onClick={() => setOrderStatusFilter(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    orderStatusFilter === value
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No orders found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Reference */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-900 block">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize">
                              {order.paymentMethod === 'credit_card'
                                ? 'Card'
                                : order.paymentMethod === 'transfer'
                                ? 'Wire Transfer'
                                : 'Cash on Delivery'}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-900 block">
                              {order.customer.fullName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {order.customer.city}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          {/* Items count & preview */}
                          <td className="py-3 px-4 text-slate-700">
                            <span className="font-medium">{totalQty} {totalQty === 1 ? 'item' : 'items'}</span>
                            <span className="text-[11px] text-slate-400 block line-clamp-1">
                              {order.items.map((i) => i.name).join(', ')}
                            </span>
                          </td>

                          {/* Total */}
                          <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                            {order.total.toFixed(2)}€
                          </td>

                          {/* Status changer dropdown */}
                          <td className="py-3 px-4">
                            <select
                              id={`select-status-${order.id}`}
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none ${getStatusBadgeClass(
                                order.status
                              )}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Preparation">In Preparation</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <button
                              id={`btn-view-order-${order.id}`}
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(orderId, status) => {
          onUpdateOrderStatus(orderId, status);
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status });
          }
        }}
      />
    </div>
  );
};
