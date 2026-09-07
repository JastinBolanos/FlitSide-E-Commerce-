import { ProductSize } from './product';

export type OrderStatus = 'Pendiente' | 'En preparación' | 'Enviado' | 'Entregado' | 'Cancelado';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  selectedSize: ProductSize;
  selectedColor: string;
  quantity: number;
  imageUrl: string;
}

export type PaymentMethod = 'credit_card' | 'transfer' | 'cash_on_delivery';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
