import { CartItem, CustomerInfo, Order, OrderItem, PaymentMethod } from '../models';
import { CartDomainService } from './cartDomainService';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Pure Domain Service for Order creation, validation, and status rules.
 */
export class OrderDomainService {
  /**
   * Validates customer information according to e-commerce domain standards
   */
  public static validateCustomer(customer: CustomerInfo): ValidationResult {
    const errors: Record<string, string> = {};

    if (!customer.fullName.trim() || customer.fullName.trim().length < 3) {
      errors.fullName = 'Please enter your complete full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email.trim() || !emailRegex.test(customer.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!customer.phone.trim() || customer.phone.trim().length < 8) {
      errors.phone = 'Please enter a valid contact phone number.';
    }

    if (!customer.address.trim() || customer.address.trim().length < 5) {
      errors.address = 'Please enter complete shipping address.';
    }

    if (!customer.city.trim() || customer.city.trim().length < 2) {
      errors.city = 'Please enter your city or municipality.';
    }

    if (!customer.postalCode.trim() || customer.postalCode.trim().length < 3) {
      errors.postalCode = 'Please enter a valid postal code.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Converts cart items into order line items
   */
  public static mapCartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
    }));
  }

  /**
   * Generates a unique, standardized order number
   */
  public static generateOrderNumber(): string {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `FLT-${new Date().getFullYear()}-${randomHex}`;
  }

  /**
   * Creates a valid, immutable Order entity
   */
  public static createOrderEntity(
    customer: CustomerInfo,
    cartItems: CartItem[],
    discountAmount: number,
    paymentMethod: PaymentMethod
  ): Order {
    const orderItems = this.mapCartItemsToOrderItems(cartItems);
    const subtotal = CartDomainService.calculateSubtotal(cartItems);
    const isFreeShipping = subtotal >= 80;
    const shipping = isFreeShipping ? 0 : 4.9;
    const total = Math.max(0, Number((subtotal - discountAmount + shipping).toFixed(2)));

    const now = new Date().toISOString();

    return {
      id: `ord-${Date.now()}`,
      orderNumber: this.generateOrderNumber(),
      customer,
      items: orderItems,
      subtotal,
      discount: discountAmount,
      shipping,
      total,
      paymentMethod,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };
  }
}
