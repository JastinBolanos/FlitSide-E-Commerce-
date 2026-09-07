import { useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, CartTotals, Product, ProductSize } from '../../domain/models';
import { CartDomainService } from '../../domain/services/cartDomainService';
import { LocalStorageAdapter } from '../../infrastructure/storage/localStorageAdapter';
import { STORAGE_KEYS } from '../../core/constants';

export interface UseCartReturn {
  cartItems: CartItem[];
  totals: CartTotals;
  totalCartCount: number;
  addToCart: (
    product: Product,
    size: ProductSize,
    color: string,
    quantity?: number
  ) => { success: boolean; message: string };
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
}

export function useCart(): UseCartReturn {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return LocalStorageAdapter.getItem<CartItem[]>(
      STORAGE_KEYS.CART,
      [],
      STORAGE_KEYS.LEGACY_CART
    );
  });

  // Sync with persistent storage on state change
  useEffect(() => {
    LocalStorageAdapter.setItem(STORAGE_KEYS.CART, cartItems);
  }, [cartItems]);

  const totals = useMemo(() => {
    return CartDomainService.calculateTotals(cartItems);
  }, [cartItems]);

  const totalCartCount = totals.totalQuantity;

  const addToCart = useCallback(
    (
      product: Product,
      size: ProductSize,
      color: string,
      quantity: number = 1
    ): { success: boolean; message: string } => {
      const result = CartDomainService.addItem(cartItems, product, size, color, quantity);
      if (!result.success) {
        return { success: false, message: result.error || 'No se pudo añadir la prenda.' };
      }

      setCartItems(result.items);
      return { success: true, message: `"${product.name}" añadido a la bolsa.` };
    },
    [cartItems]
  );

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setCartItems((prev) => CartDomainService.updateQuantity(prev, index, quantity));
  }, []);

  const removeItem = useCallback((index: number) => {
    setCartItems((prev) => CartDomainService.removeItem(prev, index));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return {
    cartItems,
    totals,
    totalCartCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
