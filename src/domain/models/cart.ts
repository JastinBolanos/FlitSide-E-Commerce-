import { Product, ProductSize } from './product';

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  selectedColor: string;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  isFreeShipping: boolean;
  remainingForFreeShipping: number;
  progressPercent: number;
  totalQuantity: number;
}

export interface AppliedPromo {
  code: string;
  percent: number;
}
