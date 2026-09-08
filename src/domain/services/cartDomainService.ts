import { CartItem, CartTotals, Product, ProductSize } from '../models';
import { BUSINESS_RULES, VALID_PROMO_CODES } from '../../core/constants';

/**
 * Pure Domain Service for Cart calculations and business operations.
 * Zero UI/React dependencies. High testability and reliability.
 */
export class CartDomainService {
  /**
   * Calculates subtotal of given cart items
   */
  public static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  /**
   * Calculates discount amount given subtotal and discount percentage
   */
  public static calculateDiscount(subtotal: number, percent: number): number {
    if (percent <= 0 || subtotal <= 0) return 0;
    return Number((subtotal * (percent / 100)).toFixed(2));
  }

  /**
   * Determines shipping cost based on subtotal and free shipping threshold
   */
  public static calculateShipping(subtotal: number, itemCount: number): number {
    if (itemCount === 0) return 0;
    return subtotal >= BUSINESS_RULES.FREE_SHIPPING_THRESHOLD
      ? 0
      : BUSINESS_RULES.STANDARD_SHIPPING_COST;
  }

  /**
   * Calculates comprehensive cart totals
   */
  public static calculateTotals(items: CartItem[], discountPercent: number = 0): CartTotals {
    const subtotal = this.calculateSubtotal(items);
    const discountAmount = this.calculateDiscount(subtotal, discountPercent);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCost = this.calculateShipping(subtotal, totalQuantity);
    const total = Math.max(0, Number((subtotal - discountAmount + shippingCost).toFixed(2)));

    const isFreeShipping = subtotal >= BUSINESS_RULES.FREE_SHIPPING_THRESHOLD;
    const remainingForFreeShipping = Math.max(0, BUSINESS_RULES.FREE_SHIPPING_THRESHOLD - subtotal);
    const progressPercent = Math.min(
      100,
      Number(((subtotal / BUSINESS_RULES.FREE_SHIPPING_THRESHOLD) * 100).toFixed(1))
    );

    return {
      subtotal,
      discountAmount,
      shippingCost,
      total,
      isFreeShipping,
      remainingForFreeShipping,
      progressPercent,
      totalQuantity,
    };
  }

  /**
   * Validates a promotional code and returns the discount percentage if valid
   */
  public static validatePromoCode(code: string): { isValid: boolean; percent: number; normalizedCode: string } {
    const normalizedCode = code.trim().toUpperCase();
    const percent = VALID_PROMO_CODES[normalizedCode];

    if (percent !== undefined) {
      return { isValid: true, percent, normalizedCode };
    }
    return { isValid: false, percent: 0, normalizedCode };
  }

  /**
   * Pure function to add an item to the cart or increment quantity if variant matches
   */
  public static addItem(
    currentItems: CartItem[],
    product: Product,
    size: ProductSize,
    color: string,
    quantity: number = 1
  ): { items: CartItem[]; success: boolean; error?: string } {
    if (product.stock <= 0) {
      return { items: currentItems, success: false, error: 'This garment is currently out of stock.' };
    }

    const requestedQty = Math.max(1, quantity);
    const existingIndex = currentItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingIndex > -1) {
      const nextItems = [...currentItems];
      const existingItem = nextItems[existingIndex];
      const newQuantity = Math.min(product.stock, existingItem.quantity + requestedQty);

      nextItems[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
      };

      return { items: nextItems, success: true };
    }

    const newItem: CartItem = {
      product,
      selectedSize: size,
      selectedColor: color,
      quantity: Math.min(product.stock, requestedQty),
    };

    return { items: [...currentItems, newItem], success: true };
  }

  /**
   * Pure function to update item quantity respecting stock limits
   */
  public static updateQuantity(
    currentItems: CartItem[],
    index: number,
    newQuantity: number
  ): CartItem[] {
    if (newQuantity <= 0) {
      return this.removeItem(currentItems, index);
    }

    const nextItems = [...currentItems];
    const item = nextItems[index];
    if (!item) return currentItems;

    const clampedQuantity = Math.min(item.product.stock, newQuantity);
    nextItems[index] = {
      ...item,
      quantity: clampedQuantity,
    };

    return nextItems;
  }

  /**
   * Pure function to remove an item from the cart
   */
  public static removeItem(currentItems: CartItem[], index: number): CartItem[] {
    return currentItems.filter((_, i) => i !== index);
  }
}
