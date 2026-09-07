import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { Product, Order, OrderStatus, ProductSize } from './domain/models';
import {
  useCart,
  useProducts,
  useOrders,
  useAdminNavigation,
  useToast,
} from './application/hooks';

/**
 * App Root Component
 * Acts as a thin Composition Root in Clean Architecture.
 * Delegates domain & data responsibilities to specialized application hooks.
 */
export default function App() {
  // Application State Hooks (Clean Architecture)
  const { currentView, setView } = useAdminNavigation();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, pendingOrdersCount, updateOrderStatus } = useOrders();
  const {
    cartItems,
    totalCartCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const { toasts, addToast, dismissToast } = useToast();

  // Storefront Filtering UI State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [focusOrderIdInAdmin, setFocusOrderIdInAdmin] = useState<string | null>(null);

  // Cart user actions with toast feedback
  const handleAddToCart = (
    product: Product,
    size: ProductSize,
    color: string,
    quantity: number = 1
  ) => {
    const result = addToCart(product, size, color, quantity);
    addToast(result.message, result.success ? 'success' : 'error');
  };

  const handleRemoveCartItem = (index: number) => {
    removeItem(index);
    addToast('Prenda eliminada de la bolsa.', 'info');
  };

  const handleProceedToCheckout = (discount: number, promoCode: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromoCode(promoCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    clearCart();
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
    addToast(`¡Pedido ${order.orderNumber} confirmado correctamente!`, 'success');
  };

  // Admin inventory and order actions
  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const created = addProduct(productData);
    addToast(`Prenda "${created.name}" creada con éxito.`);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    const updated = updateProduct(id, updates);
    if (updated) {
      addToast(`Prenda "${updated.name}" actualizada.`);
    }
  };

  const handleDeleteProduct = (id: string) => {
    const ok = deleteProduct(id);
    if (ok) {
      addToast('Prenda eliminada del catálogo.', 'info');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = updateOrderStatus(orderId, status);
    if (updated) {
      addToast(`Pedido ${updated.orderNumber} actualizado a "${status}".`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={(v) => {
          setView(v);
          setFocusOrderIdInAdmin(null);
        }}
        cartItemCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Main View: Storefront or Admin Dashboard */}
      <main className="flex-1">
        {currentView === 'store' ? (
          <ProductCatalog
            products={products}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onQuickAdd={(p, s, c) => handleAddToCart(p, s, c, 1)}
            onOpenDetail={(p) => setDetailProduct(p)}
            onResetFilters={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <AdminDashboard
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            initialSelectedOrderId={focusOrderIdInAdmin}
          />
        )}
      </main>

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={checkoutDiscount}
        promoCode={checkoutPromoCode}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Modal with Confetti */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <Footer onSwitchView={setView} />
    </div>
  );
}
