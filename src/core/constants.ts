/**
 * FlitSide Core Constants
 * Centralized configuration and business rules constants.
 */

export const STORAGE_KEYS = {
  CART: 'flitside_cart_items_v2',
  LEGACY_CART: 'atelier_cart_items_v1',
  PRODUCTS: 'flitside_ecommerce_products_v5',
  LEGACY_PRODUCTS: 'flitside_ecommerce_products_v4',
  ORDERS: 'flitside_ecommerce_orders_v3',
  LEGACY_ORDERS: 'flitside_ecommerce_orders_v2',
} as const;

export const BUSINESS_RULES = {
  FREE_SHIPPING_THRESHOLD: 80.0,
  STANDARD_SHIPPING_COST: 4.9,
  DEFAULT_PROMO_CODE: 'FLITSIDE10',
  DEFAULT_PROMO_DISCOUNT_PERCENT: 10,
} as const;

export const VALID_PROMO_CODES: Record<string, number> = {
  FLITSIDE10: 10,
  VIP20: 20,
  ATELIER10: 10,
  MINIMAL10: 10,
};
